// 'use client'

// import { useRouter } from 'next/navigation'; // Correct import
// import { useState, useEffect } from 'react';

// export default function Tasks() {
//     const [tasks, setTasks] = useState([]);
//     const [form, setForm] = useState({ title: '', desc: '' });
//     const router = useRouter();

//     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//     const fetchTasks = async () => {
//         const res = await fetch('http://localhost:5000/api/tasks', {
//             headers: { Authorization: `Bearer ${token}`},
//         });
//         const data = await res.json();
//         setTasks(data);
//     };

//     const addTask = async (e) => {
//         e.preventDefault();
//         const res = await fetch('http://localhost:5000/api/tasks', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//           body: JSON.stringify(form),
//         });
//         if (res.ok) {
//           setForm({ title: '', desc: '' });
//           fetchTasks();
//         }
//       };

//       const deleteTask = async (id) => {
//         await fetch(`http://localhost:5000/api/tasks/${id}`, {
//           method: 'DELETE',
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         fetchTasks();
//       };

//       const handleComplete = async (id) => {
//         await fetch(`http://localhost:5000/api/tasks/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ isCompleted: true }),
//         });
//         fetchTasks();
//     };

//       useEffect(() => {
//         if(!token) router.push('/login');
//         else fetchTasks();
//       }, []);

//       return (
//         <div className='w-full h-screen bg-zinc-400 flex justify-center p-8'>
//             <div className='max-w-3xl w-full border border-slate-200 rounded-xl bg-white p-10'>
                // <h2 className='text-2xl font-semibold tracking-tighter mb-5'>Your Tasks</h2>
                // <form onSubmit={addTask}>
                //     <div className='flex items-center justify-between pb-2 border-b-2 mb-5'>
                //         <input className='w-1/3 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                //         <input className='w-1/3 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder="Description" required value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
                //         <button
                //             className="font-semibold border-[2px] rounded-lg px-2 py-1 bg-emerald-500 text-white transition-colors duration-200 hover:bg-emerald-600 active:bg-emerald-700 active:scale-95 transition-transform"
                //             type="submit"
                //         >
                //             Add Task
                //         </button>
                //     </div>
                // </form>
//                 <ul>
//                     {tasks.map((task) => (
//                         <div className='w-full mt-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50' key={task._id}>
//                             <div className='flex justify-between items-center p-2'>
//                                 <div className='flex-1'> 
//                                     <b className={`border-b-2 mr-1 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</b> - <b className={`font-light ml-2 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.desc}</b>
//                                 </div>
//                                 <div>
//                                     <button
//                                         className="border rounded-lg px-2 transition-colors duration-200 hover:bg-green-200 active:bg-green-300 active:scale-95 transition-transform mr-1"
//                                         onClick={() => handleComplete(task._id)}
//                                     >
//                                         ✔️
//                                     </button>
//                                     <button
//                                         className="border rounded-lg px-2 transition-colors duration-200 hover:bg-red-200 active:bg-red-300 active:scale-95 transition-transform"
//                                         onClick={() => deleteTask(task._id)}
//                                     >
//                                         ❌
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//       );

// }


//working update button

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';

// export default function Tasks() {
//     const [tasks, setTasks] = useState([]);
//     const [form, setForm] = useState({ title: '', desc: '' });
//     const [editingTask, setEditingTask] = useState(null); // Track the task being edited
//     const [editedTitle, setEditedTitle] = useState('');
//     const [editedDesc, setEditedDesc] = useState('');
//     const router = useRouter();

//     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//     // ... (fetchTasks, addTask, deleteTask, handleComplete functions remain the same)

    // const fetchTasks = async () => {
    //     const res = await fetch('http://localhost:5000/api/tasks', {
    //         headers: { Authorization: `Bearer ${token}`},
    //     });
    //     const data = await res.json();
    //     setTasks(data);
    // };

    // const addTask = async (e) => {
    //     e.preventDefault();
    //     const res = await fetch('http://localhost:5000/api/tasks', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    //       body: JSON.stringify(form),
    //     });
    //     if (res.ok) {
    //       setForm({ title: '', desc: '' });
    //       fetchTasks();
    //     }
    //   };

    //   const deleteTask = async (id) => {
    //     await fetch(`http://localhost:5000/api/tasks/${id}`, {
    //       method: 'DELETE',
    //       headers: { Authorization: `Bearer ${token}` },
    //     });
    //     fetchTasks();
    //   };

    //   const handleComplete = async (id) => {
    //     await fetch(`http://localhost:5000/api/tasks/${id}`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ isCompleted: true }),
    //     });
    //     fetchTasks();
    // };

//     const handleUpdate = (task) => {
//         setEditingTask(task);
//         setEditedTitle(task.title);
//         setEditedDesc(task.desc);
//     };

//     const saveUpdate = async (id) => {
//         await fetch(`http://localhost:5000/api/tasks/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ title: editedTitle, desc: editedDesc }),
//         });
//         setEditingTask(null);
//         fetchTasks();
//     };

//     const cancelUpdate = () => {
//         setEditingTask(null);
//     };

//     useEffect(() => {
//         if (!token) router.push('/login');
//         else fetchTasks();
//     }, []);

//     return (
//         <div className='w-full h-screen bg-zinc-400 flex justify-center p-8'>
//             <div className='max-w-3xl w-full border border-slate-200 rounded-xl bg-white p-10'>
//                 {/* ... (form and task list rendering) */}
                // <h2 className='text-2xl font-semibold tracking-tighter mb-5'>Your Tasks</h2>
                // <form onSubmit={addTask}>
                //     <div className='flex items-center justify-between pb-2 border-b-2 mb-5'>
                //         <input className='w-1/3 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                //         <input className='w-1/3 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder="Description" required value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
                //         <button
                //             className="font-semibold border-[2px] rounded-lg px-2 py-1 bg-emerald-500 text-white transition-colors duration-200 hover:bg-emerald-600 active:bg-emerald-700 active:scale-95 transition-transform"
                //             type="submit"
                //         >
                //             Add Task
                //         </button>
                //     </div>
                // </form>
//                 <ul>
//                     {tasks.map((task) => (
//                         <div className='w-full mt-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50' key={task._id}>
//                             <div className='flex justify-between items-center p-2'>
//                                 {editingTask && editingTask._id === task._id ? (
//                                     <div className="flex-1">
//                                         <input
//                                             className="border rounded-md p-2 mr-2"
//                                             value={editedTitle}
//                                             onChange={(e) => setEditedTitle(e.target.value)}
//                                         />
//                                         <input
//                                             className="border rounded-md p-2"
//                                             value={editedDesc}
//                                             onChange={(e) => setEditedDesc(e.target.value)}
//                                         />
//                                         <button className="border rounded-md p-2 bg-blue-500 text-white mr-1" onClick={() => saveUpdate(task._id)}>Save</button>
//                                         <button className="border rounded-md p-2" onClick={cancelUpdate}>Cancel</button>
//                                     </div>
//                                 ) : (
//                                     <div className='flex-1'>
//                                         <b className={`border-b-2 mr-1 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</b> - <b className={`font-light ml-2 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.desc}</b>
//                                     </div>
//                                 )}
//                                 <div>
                                    // <button
                                    //     className="border rounded-lg px-2 transition-colors duration-200 hover:bg-green-200 active:bg-green-300 active:scale-95 transition-transform mr-1"
                                    //     onClick={() => handleComplete(task._id)}
                                    // >
                                    //     ✔️
                                    // </button>
//                                     <button
//                                         className="border rounded-lg px-2 transition-colors duration-200 hover:bg-blue-200 active:bg-blue-300 active:scale-95 transition-transform mr-1"
//                                         onClick={() => handleUpdate(task)}
//                                     >
//                                         Update
//                                     </button>
                                    // <button
                                    //     className="border rounded-lg px-2 transition-colors duration-200 hover:bg-red-200 active:bg-red-300 active:scale-95 transition-transform"
                                    //     onClick={() => deleteTask(task._id)}
                                    // >
                                    //     ❌
                                    // </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// }


// popup update button 

'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
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

    // ... (fetchTasks, addTask, deleteTask, handleComplete functions remain the same)

    const fetchTasks = async () => {
        const res = await fetch(`${BASE_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}`},
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
        <div className='w-full h-screen bg-zinc-400 flex justify-center p-8'>
            <div className='max-w-3xl w-full border border-slate-200 rounded-xl bg-white p-10'>
                {/* ... (form and task list rendering) */}
                {/* <h2 className='text-2xl font-semibold tracking-tighter mb-5'>Your Tasks</h2> */}
                <div className='flex justify-between items-center mb-5'> {/* Added flex container */}
                    <h2 className='text-2xl font-semibold tracking-tighter'>Your Tasks</h2>
                    <button
                        className="font-semibold border rounded-lg px-3 py-1 bg-red-400 text-white transition-colors duration-200 hover:bg-red-500 active:bg-red-600 active:scale-95 transition-transform"
                        onClick={handleLogout}
                    >
                        <MdLogout />
                    </button>
                </div>
                <form onSubmit={addTask}>
                    <div className='flex items-center justify-between pb-2 border-b-2 mb-5'>
                        <input className='w-1/3 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <input className='w-1/3 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" placeholder="Description" required value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
                        <button
                            className="font-semibold border-[2px] rounded-lg px-2 py-1 bg-emerald-500 text-white transition-colors duration-200 hover:bg-emerald-600 active:bg-emerald-700 active:scale-95 transition-transform"
                            type="submit"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
                <ul>
                    {tasks.map((task) => (
                        <div className='w-full mt-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50' key={task._id}>
                            
                            <div className='flex justify-between items-center p-2'>
                                <div className='flex-1'>
                                    <b className={`border-b-2 mr-1 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</b> - <b className={`font-light ml-2 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.desc}</b>
                                </div>
                                <div>
                                    {/* ... (complete and delete buttons) */}
                                    <button
                                        className="border rounded-lg px-2 transition-colors duration-200 hover:bg-green-200 active:bg-green-300 active:scale-95 transition-transform mr-1"
                                        onClick={() => handleComplete(task._id)}
                                    >
                                        ✔️
                                    </button>
                                    <button
                                        className="border font-semibold tracking-tighter rounded-lg px-2 bg-blue-300 transition-colors duration-200 hover:bg-blue-200 active:bg-blue-300 active:scale-95 transition-transform mr-1"
                                        // onClick={() => handleUpdate(task)}
                                        onClick={() => !task.isCompleted && handleUpdate(task)} // Disable onClick when isCompleted
                                        disabled={task.isCompleted}
                                    >
                                        Edit
                                    </button>

                                    {/* ... (delete button) */}
                                    <button
                                        className="border rounded-lg px-2 transition-colors duration-200 hover:bg-red-200 active:bg-red-300 active:scale-95 transition-transform"
                                        onClick={() => deleteTask(task._id)}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </ul>

                {/* Update Modal */}
                {updateModalOpen && (
                    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center backdrop-blur-md transition-opacity duration-900">
                        <div className="bg-white p-8 rounded-lg border-2 shadow-lg transition-transform duration-300 scale-100">
                            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>
                            <input
                                className="border rounded-md p-2 mb-2 w-full"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                            />
                            <input
                                className="border rounded-md p-2 mb-4 w-full"
                                value={editedDesc}
                                onChange={(e) => setEditedDesc(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button className="border rounded-md p-2 bg-blue-500 text-white mr-2" onClick={saveUpdate}>Save</button>
                                <button className="border rounded-md p-2" onClick={cancelUpdate}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}