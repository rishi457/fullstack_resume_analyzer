import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, LogIn, UserPlus, LogOut, Cpu, Moon, Sun, History } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary-200">
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
                        <Cpu className="w-6 h-6" />
                        <span>ResuAI</span>
                    </Link>

                    <div className="flex gap-6 items-center">
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {user ? (
                            <>
                                <Link to="/dashboard" className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary-600' : 'hover:text-primary-500'}`}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link to="/history" className={`flex items-center gap-1.5 font-medium transition-colors ${location.pathname === '/history' ? 'text-primary-600' : 'hover:text-primary-500'}`}>
                                    <History className="w-4 h-4" />
                                    History
                                </Link>
                                <button onClick={logout} className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-red-500 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold border border-primary-200 dark:border-primary-800">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="flex items-center gap-1.5 font-medium hover:text-primary-600 transition-colors">
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link to="/signup" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="pt-16 min-h-[calc(100vh-64px)]">
                {children}
            </main>
        </div>
    );
};

export default Layout;
