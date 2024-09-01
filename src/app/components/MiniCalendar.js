// src/app/components/MiniCalendar.js
'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css'; // Import custom styles

export default function MiniCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-4 rounded-lg shadow-md max-w-xs mx-auto">
      <Calendar
        locale="de-DE" // Lokalisierung auf Deutsch setzen
        onChange={setDate}
        value={date}
        className="custom-calendar" // Apply custom styles
      />
    </div>

  );
}
