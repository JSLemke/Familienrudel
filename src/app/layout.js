// src/app/layout.js
'use client';

import React from 'react';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const showSidebar = false; // Die Sidebar wird immer auf "false" gesetzt, um sie vollständig zu entfernen

    return (
        <html lang="en">
            <body>
                <div className="flex h-screen overflow-hidden">
                    {/* Entferne die Sidebar hier */}
                    <div className="flex-1 flex flex-col">
                        <Navbar />
                        <main className="flex-1">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
