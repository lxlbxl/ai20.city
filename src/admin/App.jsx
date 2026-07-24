import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session/token
        const storedUser = localStorage.getItem('ai20_admin_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('ai20_admin_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('ai20_admin_user');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={
                    user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />

                {/* Login Route */}
                <Route path="/login" element={
                    !user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />
                } />

                {/* Protected Routes */}
                <Route element={user ? <Layout onLogout={handleLogout} user={user} /> : <Navigate to="/login" replace />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leads" element={<Leads />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
