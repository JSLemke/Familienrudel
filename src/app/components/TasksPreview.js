'use client';

import React, { useEffect, useState } from 'react';
import supabase from '../../utils/supabaseClient';

export default function TasksPreview() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*');

            if (error) {
                console.error('Error fetching tasks:', error.message);
            } else {
                setTasks(data);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Tagesaufgaben</h2>
            <ul>
                {tasks.slice(0, 3).map((task, index) => (
                    <li key={index} className="mb-2">
                        {task.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}
