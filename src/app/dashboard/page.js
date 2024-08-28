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
import createClientInstance from 'src/utils/supabase/client.js';
import UserCard from '../components/UserCard';

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isClient, setIsClient] = useState(false);
    const [families, setFamilies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsClient(true);

        async function fetchFamilies() {
            try {
                const supabase = createClientInstance();
                const response = await supabase
                    .from('families')
                    .select('familycode, createdby');

                if (response.error) {
                    throw new Error('Error fetching families');
                }

                setFamilies(response.data);
            } catch (err) {
                setError('Fehler beim Abrufen der Familien: ' + err.message);
                console.error(err);
            }
        }

        fetchFamilies();
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
                return (
                    <div>
                        <FamilyDashboard />
                        <h2>Families</h2>
                        {error && <p className="text-red-500">{error}</p>}
                        <ul>
                            {families.map((family) => (
                                <li key={family.familycode}>{family.familycode}</li>
                            ))}
                        </ul>
                    </div>
                );
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
