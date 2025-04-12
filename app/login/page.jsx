'use client'

import { useRouter } from 'next/navigation'; // Correct import
import { useState } from 'react';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json'},
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if(res.ok){
            localStorage.setItem('token', data.token);
            router.push('/tasks');
        }
        else{
            alert(data.error || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="w-full h-screen bg-zinc-500 flex items-center justify-center">
                <div className="border-2 bg-white p-10 rounded-2xl">
                    <h2 className="text-2xl font-semibold tracking-tighter ml-2 mb-5">Signin</h2>
                    <div className="flex flex-col items-center">
                        <input className="border-2 rounded-md m-2 p-2" type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input className="border-2 rounded-md m-2 p-2" type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <button className="w-1/2 border-2 bg-green-400 font-semibold rounded-full mt-3" type="submit">Login</button>
                        <a className="font-semibold mt-2" href='./signup'>Don't have an account? Register</a>
                    </div>
                </div>
            </div>
        </form>
    );
}