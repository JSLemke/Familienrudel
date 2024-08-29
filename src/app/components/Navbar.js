import React, { useEffect, useState } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [userName, setUserName] = useState('');
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
                setUserName(user.email);
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
            <nav className="bg-white p-4 shadow-md flex justify-between items-center">
                <div>
                    <img src="./Familienrudel.png" className="w-10 h-10" alt="FamilienRudel Logo" loading="lazy" />
                    <h1 className="text-black text-2xl font-bold"></h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    <button onClick={handleLogout} className="bg-gradient-to-r from-black to-gray-200 text-white p-2 rounded">
                        Logout
                    </button>
                </div>
            </nav>
        );
}
