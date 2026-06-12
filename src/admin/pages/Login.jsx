import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/backend/api/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm rounded-lg">
                <div className="text-center mb-8">
                    <h1 className="font-serif-display text-3xl italic">ai20 Admin</h1>
                    <p className="text-sm text-gray-500 font-sans-tech uppercase tracking-widest mt-2">Internal Access Only</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 text-sm mb-4 rounded border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-[#ff3300] outline-none font-sans-tech text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-[#ff3300] outline-none font-sans-tech text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#050505] text-[#f4f1ea] py-3 text-xs uppercase tracking-widest hover:bg-[#ff3300] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
