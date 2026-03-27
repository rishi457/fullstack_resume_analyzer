import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full py-24 px-4 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-2">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered ATS Optimization
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Perfect Your Resume <br/> with <span className="text-primary-600 dark:text-primary-400">Advanced AI</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
                        Upload your resume and get an instant ATS score, keyword suggestions, and improvement tips powered by GPT-4o-mini.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Link 
                            to={user ? "/dashboard" : "/signup"} 
                            className="px-8 py-4 bg-primary-600 text-white rounded-xl text-lg font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 transform hover:-translate-y-1"
                        >
                            Analyze Now — Free
                        </Link>
                        <Link 
                            to="/login" 
                            className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto py-20 px-4 grid md:grid-cols-3 gap-12">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <Zap className="w-10 h-10 text-primary-500 mb-6" />
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Instant Analysis</h3>
                    <p className="text-slate-600 dark:text-slate-400">Get your ATS score in seconds with deep insights into how systems view your experience.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 mb-6" />
                    <h3 className="text-xl font-bold mb-3 dark:text-white">Smart Suggestions</h3>
                    <p className="text-slate-600 dark:text-slate-400">Specific recommendations for formatting, keywords, and action verbs tailored to your field.</p>
                </div>
                <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                    <CheckCircle className="w-10 h-10 text-blue-500 mb-6" />
                    <h3 className="text-xl font-bold mb-3 dark:text-white">PDF Powered</h3>
                    <p className="text-slate-600 dark:text-slate-400">Simply upload your PDF. We extract the text and analyze the core content effortlessly.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
