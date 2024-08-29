// src/app/components/TasksPage.js
'use client';

import React, { useState, useEffect } from 'react';
import createClientInstance from 'src/utils/supabase/client.js';

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const supabase = createClientInstance();

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('inserted_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error.message);
        } else {
            setTasks(data);
        }
    };

    useEffect(() => {
        fetchTasks(); // Load tasks on component mount
    }, []);

    const addTask = async () => {
        if (newTask.trim().length === 0) {
            setStatusMessage('Task darf nicht leer sein.');
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase
            .from('tasks')
            .insert([
                {
                    task: newTask.trim(),
                    user_id: user.id, // Verwende die user.id
                    is_complete: false,
                    inserted_at: new Date(),
                },
            ]);

        if (error) {
            console.error('Error adding task:', error.message);
            setStatusMessage('Fehler beim Hinzufügen der Aufgabe.');
        } else {
            setNewTask(''); // Leert das Eingabefeld
            setStatusMessage('Aufgabe erfolgreich hinzugefügt');
            await fetchTasks(); // Aktualisiert die Liste
        }
    };

    const deleteTask = async (taskId) => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            console.error('Error deleting task:', error.message);
        }
        await fetchTasks(); // Reload tasks after deletion
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Task List</h2>
            <div className="mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="p-2 border rounded w-full"
                    placeholder="New Task"
                />
                <button onClick={addTask} className="bg-gray-500 text-white p-2 rounded mt-2">
                    Add Task
                </button>
            </div>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task.id} className="flex justify-between mb-2">
                            <span>{task.task}</span>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-500"
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ) : (
                    <p>Keine Aufgaben verfügbar</p>
                )}
            </ul>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
}
