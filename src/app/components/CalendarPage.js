'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import supabase from '../../utils/supabaseClient';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', date.toISOString().split('T')[0]);

      if (error) console.error('Error fetching events:', error.message);
      else setEvents(data);
    };

    fetchEvents();
  }, [date]);

  const addEvent = async () => {
    if (newEvent.trim()) {
      const { error } = await supabase
        .from('events')
        .insert([{ content: newEvent, date: date.toISOString().split('T')[0], created_at: new Date() }]);

      if (error) console.error('Error adding event:', error.message);
      setNewEvent('');
      await fetchEvents();
    }
  };

  const deleteEvent = async (eventId) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) console.error('Error deleting event:', error.message);
    await fetchEvents();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
      />
      <div className="mt-4">
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          className="p-2 border rounded w-full"
          placeholder="New Event"
        />
        <button onClick={addEvent} className="bg-blue-500 text-white p-2 rounded mt-2">
          Add Event
        </button>
      </div>
      <ul className="mt-4">
        {events.map((event) => (
          <li key={event.id} className="flex justify-between mb-2">
            <span>{event.content}</span>
            <button
              onClick={() => deleteEvent(event.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
