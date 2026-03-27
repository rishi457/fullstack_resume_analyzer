import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const res = await axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (err) {
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        const res = await axios.post(`${API_URL}/login`, { username, password });
        const { access_token } = res.data;
        localStorage.setItem('token', access_token);
        await fetchUser(access_token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
