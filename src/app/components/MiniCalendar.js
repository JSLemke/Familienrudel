// src/app/components/MiniCalendar.js
'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css'; // Import custom styles

export default function MiniCalendar() {
    const [date, setDate] = useState(new Date());

    return (
        <div className="p-4 bg-gradient-to-tr from-gray-800 to-gray-200 rounded-lg shadow-md max-w-xs mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Mini-Kalender</h2>
        <Calendar
          locale="de-DE" // Lokalisierung auf Deutsch setzen
          onChange={setDate}
          value={date}
          className="custom-calendar" // Apply custom styles
        />
      </div>
      
    );
}
