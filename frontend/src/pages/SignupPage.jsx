import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config';
import axios from 'axios';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_URL}/signup`, { username, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Get Started</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create your professional account</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none dark:text-white"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none dark:text-white"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                required 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none dark:text-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary-200"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                    </button>
                    
                    <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-4">
                        Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
