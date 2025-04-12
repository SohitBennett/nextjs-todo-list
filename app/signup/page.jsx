'use client';

import { useRouter } from 'next/navigation'; // Correct import
import { useState } from 'react';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: ''});
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(form),
        });
        if(res.ok) router.push('/login');
        else alert('Signup failed');
    };

    return (
        <form onSubmit={handleSubmit} >
            <div className="w-full h-screen bg-zinc-500 flex items-center justify-center">
                <div className="border-2 bg-white p-10 rounded-2xl">
                    <h2 className="text-2xl font-semibold tracking-tighter ml-2 mb-5">Signup</h2>
                    <div className="flex flex-col items-center">
                        <input className="border-2 rounded-md m-2 p-2" type="text" placeholder="Name" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <input className="border-2 rounded-md m-2 p-2" type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input className="border-2 rounded-md m-2 p-2" type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        {/* <button className="w-1/2 border-2 bg-red-400 font-semibold rounded-full mt-5 w-1/2" type="submit">Register</button> */}
                        <button className="w-1/2 border-2 bg-red-400 font-semibold rounded-full mt-5 transition-colors duration-200 active:bg-red-500 active:border-red-500" type="submit">
                            Register
                        </button>
                        <a className="font-semibold mt-2" href='./login'>Already have an account? Login</a>
                    </div>
                </div>
            </div>
        </form>

    );
}