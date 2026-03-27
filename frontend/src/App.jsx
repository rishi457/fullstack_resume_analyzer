import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a loader
    if (!user) return <Navigate to="/login" />;
    return children;
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } 
                            />
                            <Route 
                                path="/history" 
                                element={
                                    <ProtectedRoute>
                                        <HistoryPage />
                                    </ProtectedRoute>
                                } 
                            />
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
