// src/app/components/TasksPreview.js
'use client';

import React, { useEffect, useState } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';

export default function TasksPreview() {
    const supabase = createClientInstance();
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
        <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-950 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2 black text-zinc-100">Tagesaufgaben</h2>
            <ul>
                {tasks.slice(0, 3).map((task, index) => (
                    <li key={index} className="mb-2">
                        {task.task}
                    </li>
                ))}
            </ul>
        </div>
    );
}