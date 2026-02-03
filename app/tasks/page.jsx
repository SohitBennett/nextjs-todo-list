'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { MdLogout, MdSearch, MdFilterList, MdDragIndicator, MdKeyboard } from "react-icons/md";
import { BASE_URL } from '../utils/api';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState({ 
        title: '', 
        desc: '', 
        category: 'Personal',
        priority: 'Medium',
        dueDate: ''
    });
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState(null);
    const [editedTask, setEditedTask] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showStats, setShowStats] = useState(true);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [confetti, setConfetti] = useState([]);
    const [draggedTask, setDraggedTask] = useState(null);
    const router = useRouter();

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
    const priorities = ['High', 'Medium', 'Low'];

    const categoryColors = {
        Work: '#3b82f6',
        Personal: '#8b5cf6',
        Shopping: '#ec4899',
        Health: '#10b981',
        Other: '#f59e0b'
    };

    const priorityColors = {
        High: '#ef4444',
        Medium: '#f59e0b',
        Low: '#10b981'
    };

    const fetchTasks = async () => {
        const res = await fetch(`${BASE_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        // Add metadata to tasks
        const enrichedTasks = data.map(task => ({
            ...task,
            category: task.category || 'Personal',
            priority: task.priority || 'Medium',
            dueDate: task.dueDate || null,
            order: task.order || 0
        }));
        
        setTasks(enrichedTasks.sort((a, b) => a.order - b.order));
    };

    const addTask = async (e) => {
        e.preventDefault();
        const taskData = {
            ...form,
            order: tasks.length
        };
        
        const res = await fetch(`${BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(taskData),
        });
        if (res.ok) {
            setForm({ title: '', desc: '', category: 'Personal', priority: 'Medium', dueDate: '' });
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
        
        // Trigger confetti
        triggerConfetti();
        fetchTasks();
    };

    const triggerConfetti = () => {
        const newConfetti = Array.from({ length: 50 }, (_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 100,
            delay: Math.random() * 0.3,
            duration: 2 + Math.random() * 1
        }));
        setConfetti(newConfetti);
        setTimeout(() => setConfetti([]), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    const handleUpdate = (task) => {
        setTaskToUpdate(task);
        setEditedTask({
            title: task.title,
            desc: task.desc,
            category: task.category || 'Personal',
            priority: task.priority || 'Medium',
            dueDate: task.dueDate || ''
        });
        setUpdateModalOpen(true);
    };

    const saveUpdate = async () => {
        await fetch(`${BASE_URL}/api/tasks/${taskToUpdate._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editedTask),
        });
        setUpdateModalOpen(false);
        fetchTasks();
    };

    const cancelUpdate = () => {
        setUpdateModalOpen(false);
    };

    // Drag and drop handlers
    const handleDragStart = (task) => {
        setDraggedTask(task);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (targetTask) => {
        if (!draggedTask || draggedTask._id === targetTask._id) return;

        const reorderedTasks = [...tasks];
        const draggedIndex = reorderedTasks.findIndex(t => t._id === draggedTask._id);
        const targetIndex = reorderedTasks.findIndex(t => t._id === targetTask._id);

        reorderedTasks.splice(draggedIndex, 1);
        reorderedTasks.splice(targetIndex, 0, draggedTask);

        // Update order
        const updatedTasks = reorderedTasks.map((task, index) => ({
            ...task,
            order: index
        }));

        setTasks(updatedTasks);
        setDraggedTask(null);

        // Update order in backend
        for (const task of updatedTasks) {
            await fetch(`${BASE_URL}/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ order: task.order }),
            });
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
        const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
        const matchesStatus = filterStatus === 'All' || 
                             (filterStatus === 'Completed' && task.isCompleted) ||
                             (filterStatus === 'Active' && !task.isCompleted);
        
        return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });

    // Calculate stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.isCompleted).length,
        active: tasks.filter(t => !t.isCompleted).length,
        completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0,
        highPriority: tasks.filter(t => t.priority === 'High' && !t.isCompleted).length,
        overdue: tasks.filter(t => !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()).length
    };

    // Calculate days until due
    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
            // Ctrl/Cmd + N for new task
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('task-title-input')?.focus();
            }
            // ? for shortcuts
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                setShowShortcuts(!showShortcuts);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showShortcuts]);

    useEffect(() => {
        if (!token) router.push('/login');
        else fetchTasks();
    }, []);

    return (
        <div className='min-h-screen w-full bg-black flex justify-center px-4 py-8 relative overflow-hidden'>
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

                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }

                .fade-in {
                    animation: fadeIn 0.6s ease-out;
                }

                .modal-fade-in {
                    animation: modalFadeIn 0.3s ease-out;
                }

                .confetti {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: #E50914;
                    animation: confettiFall linear forwards;
                    z-index: 1000;
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

                .netflix-select {
                    background: #333333;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    padding: 12px 16px;
                    font-size: 14px;
                    transition: background 0.2s ease;
                    cursor: pointer;
                }

                .netflix-select:focus {
                    outline: none;
                    background: #454545;
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
                    cursor: grab;
                }

                .task-card:active {
                    cursor: grabbing;
                }

                .task-card:hover {
                    background: #222222;
                    border-color: #444444;
                }

                .task-card.dragging {
                    opacity: 0.5;
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

                .stat-card {
                    background: #1a1a1a;
                    border: 1px solid #333333;
                    border-radius: 4px;
                    padding: 16px;
                    text-align: center;
                    transition: all 0.2s ease;
                }

                .stat-card:hover {
                    background: #222222;
                    border-color: #E50914;
                }

                .category-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    margin-right: 8px;
                }

                .priority-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    margin-right: 8px;
                }

                .due-date-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    background: #333333;
                    color: white;
                }

                .due-date-badge.overdue {
                    background: #ef4444;
                    animation: pulse 2s infinite;
                }

                .due-date-badge.soon {
                    background: #f59e0b;
                }

                .filter-button {
                    background: transparent;
                    border: 1px solid #555555;
                    border-radius: 4px;
                    color: white;
                    padding: 8px 16px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-right: 8px;
                }

                .filter-button:hover {
                    background: #333333;
                }

                .filter-button.active {
                    background: #E50914;
                    border-color: #E50914;
                }
            `}</style>

            {/* Confetti */}
            {confetti.map(c => (
                <div
                    key={c.id}
                    className="confetti"
                    style={{
                        left: `${c.left}%`,
                        animationDelay: `${c.delay}s`,
                        animationDuration: `${c.duration}s`,
                        background: ['#E50914', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)]
                    }}
                />
            ))}

            <div className='max-w-6xl w-full fade-in'>
                {/* Header */}
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-white text-3xl font-bold'>Your Tasks</h1>
                    <div className="flex gap-3">
                        <button 
                            className="logout-button" 
                            onClick={() => setShowShortcuts(!showShortcuts)}
                            title="Keyboard Shortcuts (?)"
                        >
                            <MdKeyboard size={18} />
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            <MdLogout size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Stats Dashboard */}
                {showStats && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                        <div className="stat-card">
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                            <div className="text-gray-400 text-sm mt-1">Total Tasks</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
                            <div className="text-gray-400 text-sm mt-1">Completed</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-3xl font-bold text-blue-500">{stats.active}</div>
                            <div className="text-gray-400 text-sm mt-1">Active</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-3xl font-bold text-yellow-500">{stats.completionRate}%</div>
                            <div className="text-gray-400 text-sm mt-1">Completion</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-3xl font-bold text-red-500">{stats.highPriority}</div>
                            <div className="text-gray-400 text-sm mt-1">High Priority</div>
                        </div>
                        <div className="stat-card">
                            <div className="text-3xl font-bold text-orange-500">{stats.overdue}</div>
                            <div className="text-gray-400 text-sm mt-1">Overdue</div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex gap-3 mb-4">
                        <div className="flex-1 relative">
                            <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                id="search-input"
                                className='netflix-input w-full pl-12'
                                type="text"
                                placeholder="Search tasks... (Ctrl+K)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center">
                        <MdFilterList className="text-gray-400" size={20} />
                        
                        <select 
                            className="netflix-select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select 
                            className="netflix-select"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="All">All Priorities</option>
                            {priorities.map(pri => (
                                <option key={pri} value={pri}>{pri}</option>
                            ))}
                        </select>

                        <select 
                            className="netflix-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                {/* Add Task Form */}
                <form onSubmit={addTask} className="mb-8 bg-neutral-900 p-6 rounded-md border border-neutral-700">
                    <h2 className="text-white text-xl font-bold mb-4">Add New Task</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
                        <input
                            id="task-title-input"
                            className='netflix-input w-full'
                            type="text"
                            placeholder="Task Title (Ctrl+N)"
                            required
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                        <input
                            className='netflix-input w-full'
                            type="text"
                            placeholder="Description"
                            required
                            value={form.desc}
                            onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                        <select 
                            className="netflix-select"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select 
                            className="netflix-select"
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        >
                            {priorities.map(pri => (
                                <option key={pri} value={pri}>{pri}</option>
                            ))}
                        </select>

                        <input
                            className='netflix-input'
                            type="date"
                            value={form.dueDate}
                            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                        />

                        <button className="netflix-button" type="submit">
                            Add Task
                        </button>
                    </div>
                </form>

                {/* Tasks List */}
                <div>
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                {searchQuery || filterCategory !== 'All' || filterPriority !== 'All' || filterStatus !== 'All'
                                    ? 'No tasks match your filters.'
                                    : 'No tasks yet. Add your first task above!'}
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => {
                            const daysUntil = getDaysUntilDue(task.dueDate);
                            const isOverdue = daysUntil !== null && daysUntil < 0;
                            const isSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 3;

                            return (
                                <div 
                                    className={`task-card ${draggedTask?._id === task._id ? 'dragging' : ''}`}
                                    key={task._id}
                                    draggable
                                    onDragStart={() => handleDragStart(task)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(task)}
                                >
                                    <div className='flex items-start gap-3'>
                                        <MdDragIndicator className="text-gray-600 mt-1 cursor-grab" size={20} />
                                        
                                        <div className='flex-1'>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h3 className={`text-white font-semibold text-lg mb-2 ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                                                        {task.title}
                                                    </h3>
                                                    <p className={`text-gray-400 text-sm mb-3 ${task.isCompleted ? 'line-through opacity-50' : ''}`}>
                                                        {task.desc}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-2 items-center">
                                                        <span 
                                                            className="category-badge"
                                                            style={{ 
                                                                background: categoryColors[task.category] + '20',
                                                                color: categoryColors[task.category],
                                                                border: `1px solid ${categoryColors[task.category]}`
                                                            }}
                                                        >
                                                            {task.category}
                                                        </span>
                                                        
                                                        <span 
                                                            className="priority-badge"
                                                            style={{ 
                                                                background: priorityColors[task.priority] + '20',
                                                                color: priorityColors[task.priority],
                                                                border: `1px solid ${priorityColors[task.priority]}`
                                                            }}
                                                        >
                                                            {task.priority} Priority
                                                        </span>

                                                        {task.dueDate && (
                                                            <span className={`due-date-badge ${isOverdue ? 'overdue' : isSoon ? 'soon' : ''}`}>
                                                                {isOverdue 
                                                                    ? `Overdue by ${Math.abs(daysUntil)} days` 
                                                                    : daysUntil === 0 
                                                                    ? 'Due today!' 
                                                                    : `Due in ${daysUntil} days`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center ml-4">
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
                                    </div>
                                </div>
                            );
                        })
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
                                    value={editedTask.title}
                                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                />
                                <input
                                    className="netflix-input w-full"
                                    placeholder="Description"
                                    value={editedTask.desc}
                                    onChange={(e) => setEditedTask({ ...editedTask, desc: e.target.value })}
                                />
                                <select 
                                    className="netflix-select w-full"
                                    value={editedTask.category}
                                    onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <select 
                                    className="netflix-select w-full"
                                    value={editedTask.priority}
                                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                >
                                    {priorities.map(pri => (
                                        <option key={pri} value={pri}>{pri}</option>
                                    ))}
                                </select>
                                <input
                                    className='netflix-input w-full'
                                    type="date"
                                    value={editedTask.dueDate}
                                    onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
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

                {/* Keyboard Shortcuts Modal */}
                {showShortcuts && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center backdrop-blur-sm z-50" onClick={() => setShowShortcuts(false)}>
                        <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-md w-full max-w-md modal-fade-in" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-white text-2xl font-bold mb-6">Keyboard Shortcuts</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-white">
                                    <span>Search tasks</span>
                                    <kbd className="px-3 py-1 bg-neutral-800 rounded border border-neutral-600">Ctrl+K</kbd>
                                </div>
                                <div className="flex justify-between items-center text-white">
                                    <span>New task</span>
                                    <kbd className="px-3 py-1 bg-neutral-800 rounded border border-neutral-600">Ctrl+N</kbd>
                                </div>
                                <div className="flex justify-between items-center text-white">
                                    <span>Show shortcuts</span>
                                    <kbd className="px-3 py-1 bg-neutral-800 rounded border border-neutral-600">?</kbd>
                                </div>
                            </div>
                            <button className="netflix-button w-full mt-6" onClick={() => setShowShortcuts(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}