'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MdLogout } from "react-icons/md";
import { BASE_URL } from '../utils/api';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ title: '', desc: '' });
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDesc, setEditedDesc] = useState('');
    const router = useRouter();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const fetchTasks = async () => {
        const res = await fetch(`${BASE_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(data);
        setTasks(data);
    };

    const addTask = async (e) => {
        e.preventDefault();
        const res = await fetch(`${BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setForm({ title: '', desc: '' });
            fetchTasks();
        }
    };

    const deleteTask = async (id) => {
        await fetch(`${BASE_URL}/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
    };

    const handleComplete = async (id) => {
        await fetch(`${BASE_URL}/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isCompleted: true }),
        });
        fetchTasks();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleUpdate = (task) => {
        setTaskToUpdate(task);
        setEditedTitle(task.title);
        setEditedDesc(task.desc);
        setUpdateModalOpen(true);
    };

    const saveUpdate = async () => {
        await fetch(`${BASE_URL}/api/tasks/${taskToUpdate._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: editedTitle, desc: editedDesc }),
        });
        setUpdateModalOpen(false);
        fetchTasks();
    };

    const cancelUpdate = () => {
        setUpdateModalOpen(false);
    };

    useEffect(() => {
        if (!token) router.push('/login');
        else fetchTasks();
    }, []);

    return (
        <div className='min-h-screen w-full bg-black flex justify-center px-4 py-8'>
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Netflix+Sans:wght@400;500;700&display=swap');
                
                * {
                    font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .fade-in {
                    animation: fadeIn 0.6s ease-out;
                }

                .modal-fade-in {
                    animation: modalFadeIn 0.3s ease-out;
                }

                .netflix-input {
                    background: #333333;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    padding: 12px 16px;
                    font-size: 14px;
                    transition: background 0.2s ease;
                }

                .netflix-input:focus {
                    outline: none;
                    background: #454545;
                }

                .netflix-input::placeholder {
                    color: #8c8c8c;
                }

                .netflix-button {
                    background: #E50914;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    font-size: 14px;
                    font-weight: 500;
                    padding: 12px 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .netflix-button:hover {
                    background: #f40612;
                }

                .netflix-button:active {
                    background: #c40812;
                    transform: scale(0.98);
                }

                .task-card {
                    background: #1a1a1a;
                    border: 1px solid #333333;
                    border-radius: 4px;
                    padding: 16px;
                    margin-bottom: 12px;
                    transition: all 0.2s ease;
                }

                .task-card:hover {
                    background: #222222;
                    border-color: #444444;
                }

                .action-button {
                    background: transparent;
                    border: 1px solid #555555;
                    border-radius: 4px;
                    color: white;
                    padding: 6px 12px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-left: 8px;
                }

                .action-button:hover {
                    background: #333333;
                    border-color: #666666;
                }

                .action-button.complete:hover {
                    background: #1a5f1a;
                    border-color: #2d8f2d;
                }

                .action-button.edit:hover {
                    background: #1a3d5f;
                    border-color: #2d5f8f;
                }

                .action-button.delete:hover {
                    background: #5f1a1a;
                    border-color: #8f2d2d;
                }

                .action-button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .logout-button {
                    background: transparent;
                    border: 1px solid #555555;
                    border-radius: 4px;
                    color: white;
                    padding: 8px 16px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .logout-button:hover {
                    background: #E50914;
                    border-color: #E50914;
                }
            `}</style>

            <div className='max-w-4xl w-full fade-in'>
                {/* Header */}
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-white text-3xl font-bold'>Your Tasks</h1>
                    <button className="logout-button" onClick={handleLogout}>
                        <MdLogout size={18} />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Add Task Form */}
                <form onSubmit={addTask} className="mb-8">
                    <div className='flex gap-3 items-end'>
                        <div className="flex-1">
                            <input
                                className='netflix-input w-full'
                                type="text"
                                placeholder="Task Title"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <input
                                className='netflix-input w-full'
                                type="text"
                                placeholder="Description"
                                required
                                value={form.desc}
                                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                            />
                        </div>
                        <button className="netflix-button" type="submit">
                            Add Task
                        </button>
                    </div>
                </form>

                {/* Tasks List */}
                <div>
                    {tasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No tasks yet. Add your first task above!</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div className='task-card' key={task._id}>
                                <div className='flex justify-between items-center'>
                                    <div className='flex-1'>
                                        <h3 className={`text-white font-semibold text-lg mb-1 ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <p className={`text-gray-400 text-sm ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                                            {task.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            className="action-button complete"
                                            onClick={() => handleComplete(task._id)}
                                            disabled={task.isCompleted}
                                        >
                                            ✓ Complete
                                        </button>
                                        <button
                                            className="action-button edit"
                                            onClick={() => !task.isCompleted && handleUpdate(task)}
                                            disabled={task.isCompleted}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-button delete"
                                            onClick={() => deleteTask(task._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Update Modal */}
                {updateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center backdrop-blur-sm z-50">
                        <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-md w-full max-w-md modal-fade-in">
                            <h2 className="text-white text-2xl font-bold mb-6">Edit Task</h2>
                            <div className="space-y-4">
                                <input
                                    className="netflix-input w-full"
                                    placeholder="Task Title"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <input
                                    className="netflix-input w-full"
                                    placeholder="Description"
                                    value={editedDesc}
                                    onChange={(e) => setEditedDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button className="netflix-button flex-1" onClick={saveUpdate}>
                                    Save Changes
                                </button>
                                <button
                                    className="action-button flex-1"
                                    onClick={cancelUpdate}
                                    style={{ marginLeft: 0 }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}