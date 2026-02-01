'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BASE_URL } from '../utils/api';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            router.push('/tasks');
        } else {
            alert(data.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-8">
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

                .fade-in {
                    animation: fadeIn 0.6s ease-out;
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

            <div className="w-full max-w-md fade-in">
                {/* Netflix-style Card */}
                <div className="bg-black bg-opacity-75 rounded-md px-16 py-16">
                    {/* Header */}
                    <h1 className="text-white text-3xl font-bold mb-7">
                        Sign In
                    </h1>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                            Sign In
                        </button>
                    </form>

                    {/* Signup Link */}
                    <div className="mt-4">
                        <span className="text-gray-400 text-base">
                            New to the app?{' '}
                            <a href="./signup" className="netflix-link">
                                Sign up now
                            </a>
                            .
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}