// src/app/components/MiniCalendar.js
'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function MiniCalendar() {
    const [date, setDate] = useState(new Date());

    return (
        <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Mini-Kalender</h2>
            <Calendar
                locale="de-DE" // Lokalisierung auf Deutsch setzen
                onChange={setDate}
                value={date}
            />
        </div>
    );
}
