// src/app/layout.js
'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        // Sidebar wird nur angezeigt, wenn der Pfad nicht '/login' oder '/register' ist
        setShowSidebar(!['/login', '/register'].includes(pathname));
    }, [pathname]);

    return (
        <html lang="en">
            <body>
                <div className="flex h-screen overflow-hidden">
                    {showSidebar && <Sidebar />}
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <main className="flex-1 p-8 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
