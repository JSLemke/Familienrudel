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
        <nav className="p-4 shadow-md flex justify-between items-center">
            <div>

            </div>

            <div className="flex items-center mr-4 space-x-4">
                <button onClick={handleLogout} className="bg-[#e03131] text-white p-2 rounded">
                    Logout
                </button>
            </div>
        </nav>
    );
}
