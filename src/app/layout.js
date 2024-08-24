'use client';

import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex-1">
          <Navbar />
          <main className="p-4 h-full overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
