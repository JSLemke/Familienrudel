import React, { useEffect, useState } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [userName, setUserName] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClientInstance();
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Error fetching user:', error.message);
                return;
            }

            if (user) {
                const { data, error: profileError } = await supabase
                    .from('users')
                    .select('nickname, photo_url')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile data:', profileError.message);
                    return;
                }

                setUserName(data.nickname); // Nickname setzen
                setProfileImage(data.photo_url); // Profilbild-URL setzen
            } else {
                console.log('No user is logged in');
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        const supabase = createClientInstance();
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            router.push('/login');
        }
    };

    return (
        <nav className="p-4 shadow-md flex justify-between items-center">
            <div></div>

            <div className="flex items-center mr-4 space-x-4">
                {userName && profileImage && (
                    <div className="flex items-center space-x-2">
                        <img src={profileImage} alt="Profile" className="w-8 h-8 rounded-full" />
                        <span className="text-white font-medium">{userName}</span>
                    </div>
                )}
                <button onClick={handleLogout} className="bg-[#e03131] text-white p-2 rounded">
                    Logout
                </button>
            </div>
        </nav>
    );
}
