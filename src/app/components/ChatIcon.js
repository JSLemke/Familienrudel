// src/app/components/ChatIcon.js

'use client';

import React, { useState, useEffect } from 'react';
import ChatPage from './ChatPage';

export default function ChatIcon() {
    const [newMessages, setNewMessages] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
       
       
        setNewMessages(true);

    
        setNewMessages(false);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="text-2xl p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
                💬
            </button>
            {newMessages && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full"></span>
            )}
            {isChatOpen && (
                <div className="absolute right-0 mt-2 w-80 h-96 bg-white shadow-lg rounded-lg p-4">
                    <ChatPage />
                </div>
            )}
        </div>
    );
}
