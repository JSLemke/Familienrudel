'use client';

import React from 'react';

export default function Sidebar({ setCurrentPage, isOpen, setIsOpen }) {
    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 rounded-lg text-stone-100 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:static md:flex md:flex-col md:w-64 z-50`}
            >
                <div className="p-4 flex items-center">
                    <h2 className="text-2xl font-bold">Familienrudel</h2>

                </div>
                <nav className="space-y-2">
                    <a
                        onClick={() => {
                            setCurrentPage('home');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Home (Familientafel)
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('profile');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Profil
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('profileEdit');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Profil Bearbeiten
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('chat');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Chat
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('calendar');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Kalender
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('tasks');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Tagesaufgaben
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('shoppingList');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Einkaufsliste
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('gps');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        LiveMap
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('settings');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Dashboard Bearbeiten
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('familyMembers');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Familienmitglieder
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('invite');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Einladen
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('tictactoe');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        TicTacToe
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('memory');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Memory
                    </a>
                    <a
                        onClick={() => {
                            setCurrentPage('tetris');
                            setIsOpen(false);
                        }}
                        className="block px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Tetris
                    </a>
                </nav>
            </div>

            {/* Overlay for closing the sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
}
