'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FamilyDashboard from '../components/FamilyDashboard';
import Profile from '../components/Profile';
import ProfileEdit from '../components/ProfileEdit';
import ChatPage from '../components/ChatPage';
import CalendarPage from 'src/app/components/CalendarPage/CalendarPage.js';
import TasksPage from '../components/TasksPage';
import ShoppingListPage from '../components/ShoppingListPage';
import GPSPage from '../components/GPSPage';
import Settings from 'src/app/components/Settin/Settings.js';
import ContactList from '../components/ContactList';
import Invite from '../components/Invite';
import Tetris from '../games/Tetris/Tetris';
import Memory from '../games/Memory/Memory';
import TicTacToe from '../games/TicTacToe/TicTacToe';

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (currentPage) {
            case 'profile':
                return <Profile />;
            case 'profileEdit':
                return <ProfileEdit />;
            case 'chat':
                return <ChatPage />;
            case 'calendar':
                return <CalendarPage />;
            case 'tasks':
                return <TasksPage />;
            case 'shoppingList':
                return <ShoppingListPage />;
            case 'gps':
                return <GPSPage />;
            case 'settings':
                return <Settings />;
            case 'familyMembers':
                return <ContactList />;
            case 'invite':
                return <Invite />;
            case 'tetris':
                return <Tetris />;
            case 'memory':
                return <Memory />;
            case 'tictactoe':
                return <TicTacToe />;
            case 'home':
            default:
                return <FamilyDashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-white bg-gradient-to-tr from-black to-gray-200 p-3 rounded-md"
                >
                    ☰
                </button>
            </div>

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} setCurrentPage={setCurrentPage} />

            <div className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}
