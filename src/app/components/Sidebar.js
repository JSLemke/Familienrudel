'use client';

import React from 'react';

export default function Sidebar({ setCurrentPage }) {
    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
            <nav className="space-y-2">
                <a onClick={() => setCurrentPage('home')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Home (Familientafel)
                </a>
                <a onClick={() => setCurrentPage('profile')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Profil
                </a>
                <a onClick={() => setCurrentPage('profileEdit')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Profil Bearbeiten
                </a>
                <a onClick={() => setCurrentPage('chat')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Chat
                </a>
                <a onClick={() => setCurrentPage('calendar')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Kalender
                </a>
                <a onClick={() => setCurrentPage('tasks')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Tagesaufgaben
                </a>
                <a onClick={() => setCurrentPage('shoppingList')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Einkaufsliste
                </a>
                <a onClick={() => setCurrentPage('gps')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    LiveMap
                                    </a>
                <a onClick={() => setCurrentPage('settings')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Dashboard Bearbeiten
                </a>
                <a onClick={() => setCurrentPage('familyMembers')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Familienmitglieder
                </a>
                <a onClick={() => setCurrentPage('invite')} className="block px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
                    Einladen
                </a>
            </nav>
        </div>
    );
}
