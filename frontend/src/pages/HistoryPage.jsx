import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { History, FileText, Download, Eye, ArrowLeft, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API_URL from '../config';

const HistoryPage = () => {
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_URL}/history`);
                setAnalyses(res.data);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const handleDownload = async (id, filename) => {
        try {
            const response = await axios.get(`${API_URL}/download/${id}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `analysis_${filename}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download PDF. Please try again.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link to="/dashboard" className="text-primary-600 flex items-center gap-1 text-sm font-bold mb-4 hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        Analysis History <History className="w-8 h-8 text-primary-500" />
                    </h1>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : analyses.length > 0 ? (
                <div className="grid gap-6">
                    {analyses.map((item, index) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{item.filename}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" /> 
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400">
                                            <BarChart3 className="w-3.5 h-3.5" />
                                            Score: {Math.round(item.ats_score)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleDownload(item.id, item.filename)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm font-bold"
                                >
                                    <Download className="w-4 h-4" /> PDF
                                </button>
                                <Link 
                                    to={`/dashboard?view=${item.id}`}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all flex items-center gap-2 text-sm font-bold"
                                >
                                    <Eye className="w-4 h-4" /> View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed">
                    <History className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">No analyses yet</h3>
                    <p className="text-slate-400 mt-2">Upload your first resume to see your history here.</p>
                    <Link to="/dashboard" className="inline-block mt-6 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all">
                        Upload Now
                    </Link>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
