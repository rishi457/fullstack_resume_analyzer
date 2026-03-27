import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, CheckCircle2, Sparkles, Loader2, AlertCircle, History, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config';

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [jdUrl, setJdUrl] = useState('');
    const [jdText, setJdText] = useState('');
    const [showJdOptions, setShowJdOptions] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const viewId = query.get('view');
        if (viewId) {
            fetchAnalysis(viewId);
        }
    }, [location]);

    const fetchAnalysis = async (id) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/analyses/${id}`);
            setResult(res.data);
        } catch (err) {
            setError("Could not load result.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setResult(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);
        if (jdUrl) formData.append('jd_url', jdUrl);
        if (jdText) formData.append('jd_text', jdText);

        try {
            const res = await axios.post(`${API_URL}/analyze`, formData);
            setResult(res.data);
        } catch (err) {
            setError('Failed to analyze resume. Ensure your PDF is valid and Groq API is setup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                    Welcome back, {user?.username} <Sparkles className="w-8 h-8 text-primary-500" />
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg mt-2">Ready to optimize your next application?</p>
            </header>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                            <Upload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            Upload New Resume
                        </h2>
                        
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    id="resume-upload"
                                />
                                <label 
                                    htmlFor="resume-upload"
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${file ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <FileText className={`w-12 h-12 mb-4 transition-colors ${file ? 'text-primary-600 dark:text-primary-400' : 'text-slate-300 dark:text-slate-600 group-hover:text-primary-400'}`} />
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                                        {file ? file.name : "Choose PDF Research"}
                                    </span>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">Maximum size 10MB</span>
                                </label>
                            </div>

                            {error && (
                                <div className="text-red-500 dark:text-red-400 text-sm flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 italic">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}

                            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                                <button 
                                    type="button"
                                    onClick={() => setShowJdOptions(!showJdOptions)}
                                    className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 mb-4"
                                >
                                    {showJdOptions ? "Hide" : "+ Add"} Job Description (Optional)
                                </button>
                                
                                {showJdOptions && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Job Link</label>
                                            <input 
                                                type="url"
                                                placeholder="https://linkedin.com/jobs/..."
                                                value={jdUrl}
                                                onChange={(e) => setJdUrl(e.target.value)}
                                                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Or Paste JD Text</label>
                                            <textarea 
                                                rows="3"
                                                placeholder="Paste the job requirements here..."
                                                value={jdText}
                                                onChange={(e) => setJdText(e.target.value)}
                                                className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-100 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    "Start Tailored Analysis"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-bl-2xl text-primary-700 dark:text-primary-400 font-bold flex items-center gap-1 shadow-sm">
                                        <CheckCircle2 className="w-4 h-4" /> Analysis Complete
                                    </div>
                                    
                                    <div className="flex justify-between items-start mb-8">
                                        <h2 className="text-2xl font-bold dark:text-white">Analysis Summary</h2>
                                        <button 
                                            onClick={async () => {
                                                const response = await axios.get(`${API_URL}/download/${result.id}`, { responseType: 'blob' });
                                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                                const link = document.createElement('a');
                                                link.href = url;
                                                link.setAttribute('download', `analysis_${result.filename}.pdf`);
                                                document.body.appendChild(link);
                                                link.click();
                                            }}
                                            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-2 font-bold text-sm"
                                        >
                                            <Download className="w-5 h-5" /> Download PDF
                                        </button>
                                    </div>
                                    
                                    {/* ATS Score Gauge Placeholder */}
                                    <div className="flex items-center gap-8 mb-10">
                                        <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-primary-500 shadow-inner bg-slate-50 dark:bg-slate-900">
                                            <span className="text-4xl font-extrabold text-primary-700 dark:text-primary-400">{Math.round(result.ats_score)}</span>
                                            <span className="absolute -bottom-6 text-xs uppercase tracking-widest font-bold text-slate-400">ATS Score</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your score is looking {result.ats_score > 70 ? 'Strong!' : 'Good but can improve.'}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 italic mt-1 text-sm leading-snug">Based on global ATS standards and keyword density.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-700 pt-8 mt-4">
                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-500" />
                                            AI Suggestions
                                        </h3>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                            {result.suggestions}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed text-slate-400 dark:text-slate-500 min-h-[400px]"
                            >
                                <FileText className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-xl font-medium">Result will appear here</p>
                                <p className="text-sm mt-2">Upload your resume to see the AI magic.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
