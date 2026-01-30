'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BASE_URL } from '../utils/api';

export default function Signup() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [focusedField, setFocusedField] = useState(null);
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
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            <style jsx>{`
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

                .input-field {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .input-field:focus {
                    transform: translateY(-2px);
                }

                .submit-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
                }

                .submit-btn:active {
                    transform: translateY(0);
                }
            `}</style>

            <form onSubmit={handleSubmit} className="w-full max-w-md fade-in">
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Sign up to get started
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                required
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className={`input-field w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent ${
                                    focusedField === 'name' ? 'border-gray-600' : 'border-gray-700'
                                }`}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className={`input-field w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent ${
                                    focusedField === 'email' ? 'border-gray-600' : 'border-gray-700'
                                }`}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                required
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                className={`input-field w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent ${
                                    focusedField === 'password' ? 'border-gray-600' : 'border-gray-700'
                                }`}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-btn w-full mt-8 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        Create Account
                    </button>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <a
                                href="./login"
                                className="text-gray-300 hover:text-white font-semibold transition-colors duration-200 underline decoration-gray-600 hover:decoration-gray-400"
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}