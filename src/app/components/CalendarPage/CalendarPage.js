'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import createClientInstance from 'src/utils/supabase/client.js';
import styles from './CalendarPage.module.css';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const supabase = createClientInstance();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        const formattedEvents = data.map(event => ({
          title: event.title,
          start: new Date(event.event_date),
          end: new Date(event.event_date),
          id: event.id,
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error during fetchEvents:', error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async ({ start, end }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('No user found');
        return;
      }

      const title = prompt('Enter Event Title');
      if (title) {
        const { error } = await supabase
          .from('events')
          .insert([{
            title,
            event_date: start.toISOString().split('T')[0],
            created_at: new Date(),
            created_by: user.id
          }]);

        if (error) {
          console.error('Error adding event:', error.message);
        } else {
          fetchEvents();
        }
      }
    } catch (error) {
      console.error('Error during addEvent:', error.message);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      console.log(`Attempting to delete event with ID: ${eventId}`); // Debugging
      const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error.message);
      } else {
        console.log('Event deleted:', data); // Output the deleted data
        fetchEvents(); 
      }
    } catch (error) {
      console.error('Error during deleteEvent:', error.message);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    addEvent({ start, end });
  };

  const handleSelectEvent = (event) => {
    if (window.confirm(`Do you want to delete the event '${event.title}'?`)) {
      console.log('Event to delete:', event); // Debugging
      deleteEvent(event.id);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 500 }}
        className={styles['custom-calendar']}
      />
    </div>
  );
}
