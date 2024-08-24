'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FamilyDashboard from '../components/FamilyDashboard';
import Profile from '../components/Profile';
import ProfileEdit from '../components/ProfileEdit';
import ChatPage from '../components/ChatPage';
import CalendarPage from '../components/CalendarPage';
import TasksPage from '../components/TasksPage';
import ShoppingListPage from '../components/ShoppingListPage';
import GPSPage from '../components/GPSPage';
import Settings from '../components/Settings';
import ContactList from '../components/ContactList';
import Invite from '../components/Invite';

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const renderContent = () => {
        if (!isClient) {
            return <div>Lade...</div>; 
        }

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
            case 'home':
            default:
                return <FamilyDashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar setCurrentPage={setCurrentPage} />
            <div className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}
