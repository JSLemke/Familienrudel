import React from 'react';

export default function UserCard({ user }) {
  console.log('Rendering UserCard with user:', user);
  
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg shadow-md mb-6">
      <img
        src={user.photoURL || '/default-profile.png'}
        alt="User Profile"
        className="w-16 h-16 rounded-full object-cover"
        onError={(e) => { 
          console.error('Fehler beim Laden des Profilbildes, Standardbild wird verwendet', e);
          e.target.src = '/default-profile.png'; 
        }}
      />
      <div>
        <h2 className="text-xl font-semibold text-white">Hi {user.displayName}</h2>
        <p className="text-white">{user.email}</p>
        <p className="text-white">{user.bio}</p>
      </div>
    </div>
  );
}
