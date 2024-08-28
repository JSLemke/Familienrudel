import { useState } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';

export default function UploadAvatar({ userId, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClientInstance();

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `public/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update user's photo_url in the database
      const { error: updateError } = await supabase
        .from('users')
        .update({ photo_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Pass the new avatar URL back to the parent component
      if (onUpload) {
        onUpload(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <label htmlFor="avatar" className="button primary block" style={{ color: '#fff', backgroundColor: '#007bff', padding: '10px 20px', marginTop: '10px', cursor: 'pointer', display: 'inline-block', borderRadius: '5px' }}>
        {uploading ? 'Uploading...' : 'Upload Avatar'}
      </label>
      <input
        style={{
          visibility: 'hidden',
          position: 'absolute',
        }}
        type="file"
        id="avatar"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
      {avatarUrl && <img src={avatarUrl} alt="Avatar" style={{ marginTop: '20px', borderRadius: '50%', border: '2px solid #007bff', width: '150px', height: '150px' }} />}
    </div>
  );
}
