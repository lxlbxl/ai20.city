import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

export default function Layout({ onLogout, user }) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-[#050505] text-[#f4f1ea] fixed h-full z-30">
                <div className="p-8 border-b border-white/10">
                    <h1 className="font-serif-display text-2xl italic">ai20 <span className="text-[#ff3300] not-italic font-sans-tech font-bold text-sm align-top">Admin</span></h1>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                    <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-[#ff3300] text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                        <LayoutDashboard size={18} />
                        <span className="text-xs uppercase tracking-widest">Dashboard</span>
                    </NavLink>
                    <NavLink to="/leads" className={({ isActive }) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-[#ff3300] text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                        <Users size={18} />
                        <span className="text-xs uppercase tracking-widest">Leads</span>
                    </NavLink>
                    <NavLink to="/clients" className={({ isActive }) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-[#ff3300] text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                        <Users size={18} />
                        <span className="text-xs uppercase tracking-widest">Clients</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-[#ff3300] text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                        <Settings size={18} />
                        <span className="text-xs uppercase tracking-widest">Settings</span>
                    </NavLink>
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 opacity-70">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-serif-display italic">
                            {user.username[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm truncate text-white">{user.username}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#ff3300] hover:text-white transition-colors">
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-12 max-w-[1600px] mx-auto w-full">
                <Outlet />
            </main>

            {/* Bottom Nav (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050505] text-[#f4f1ea] border-t border-white/10 flex justify-around items-center z-50 py-3 safe-area-bottom">
                <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-[#ff3300]' : 'text-gray-400'}`}>
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Dash</span>
                </NavLink>
                <NavLink to="/leads" className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-[#ff3300]' : 'text-gray-400'}`}>
                    <Users size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Leads</span>
                </NavLink>
                <button onClick={onLogout} className="flex flex-col items-center gap-1 p-2 text-gray-400">
                    <LogOut size={20} />
                    <span className="text-[10px] uppercase tracking-widest">Logout</span>
                </button>
            </div>
        </div>
    );
}
