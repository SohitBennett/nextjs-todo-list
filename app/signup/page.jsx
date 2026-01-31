'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BASE_URL } from '../utils/api';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) router.push('/login');
        else alert('Signup failed');
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8">
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Netflix+Sans:wght@400;500;700&display=swap');
                
                * {
                    font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                }

                .netflix-input {
                    background: #333333;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    padding: 16px 20px;
                    font-size: 16px;
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
                    font-size: 16px;
                    font-weight: 500;
                    padding: 16px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .netflix-button:hover {
                    background: #f40612;
                }

                .netflix-button:active {
                    background: #c40812;
                }

                .netflix-link {
                    color: white;
                    text-decoration: none;
                    transition: text-decoration 0.2s ease;
                }

                .netflix-link:hover {
                    text-decoration: underline;
                }
            `}</style>

            <div className="w-full max-w-md">
                {/* Netflix-style Card */}
                <div className="bg-black bg-opacity-75 rounded-md px-16 py-16">
                    {/* Header */}
                    <h1 className="text-white text-3xl font-bold mb-7">
                        Sign Up
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Name Input */}
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="netflix-input"
                        />

                        {/* Email Input */}
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="netflix-input"
                        />

                        {/* Password Input */}
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="netflix-input"
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="netflix-button mt-6"
                        >
                            Sign Up
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-4">
                        <span className="text-gray-400 text-base">
                            Already have an account?{' '}
                            <a href="./login" className="netflix-link">
                                Sign in now
                            </a>
                            .
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}