'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../../utils/supabaseClient';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error.message);
    } else {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks(); 
  }, []);

  const addTask = async () => {
    if (newTask.trim()) {
      const { error } = await supabase
        .from('tasks')
        .insert([{ content: newTask, created_at: new Date() }]);

      if (error) {
        console.error('Error adding task:', error.message);
      } else {
        setNewTask(''); 
        setStatusMessage('Aufgabe erfolgreich hinzugefügt');
        await fetchTasks(); 
      }
    }
  };

  const deleteTask = async (taskId) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) console.error('Error deleting task:', error.message);
    await fetchTasks(); 
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
        <button onClick={addTask} className="bg-blue-500 text-white p-2 rounded mt-2">
          Add Task
        </button>
      </div>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id} className="flex justify-between mb-2">
              <span>{task.content}</span>
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
    </div>
  );
}
