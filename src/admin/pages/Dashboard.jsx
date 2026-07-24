import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Users, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalLeads: 0,
        newLeadsToday: 0,
        highValueLeads: 0,
        recentLeads: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/backend/api/leads.php');
                const data = await response.json();
                if (data.status === 'success') {
                    const leads = data.data;
                    const today = new Date().toDateString();

                    setStats({
                        totalLeads: leads.length,
                        newLeadsToday: leads.filter(l => new Date(l.created_at).toDateString() === today).length,
                        highValueLeads: leads.filter(l => l.budget === '50k+').length,
                        recentLeads: leads.slice(0, 5)
                    });
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ label, value, icon: Icon, color }) => (
        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded flex items-start justify-between">
            <div>
                <span className="text-xs uppercase tracking-widest text-gray-400">{label}</span>
                <p className="font-serif-display text-4xl mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-10 ${color.bg} ${color.text}`}>
                <Icon size={24} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif-display text-4xl italic mb-2">Dashboard.</h1>
                <p className="font-sans-tech text-sm text-gray-500">Overview of your business growth</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Leads"
                    value={loading ? '-' : stats.totalLeads}
                    icon={Users}
                    color={{ bg: 'bg-blue-500', text: 'text-blue-600' }}
                />
                <StatCard
                    label="New Today"
                    value={loading ? '-' : stats.newLeadsToday}
                    icon={Clock}
                    color={{ bg: 'bg-green-500', text: 'text-green-600' }}
                />
                <StatCard
                    label="High Value"
                    value={loading ? '-' : stats.highValueLeads}
                    icon={DollarSign}
                    color={{ bg: 'bg-orange-500', text: 'text-[#ff3300]' }}
                />
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-serif-display text-xl">Recent Activity</h2>
                    <button
                        onClick={() => navigate('/leads')}
                        className="text-xs uppercase tracking-widest text-[#ff3300] hover:underline flex items-center gap-1"
                    >
                        View All <ArrowUpRight size={14} />
                    </button>
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400 text-sm">Loading activity...</div>
                    ) : stats.recentLeads.length > 0 ? (
                        stats.recentLeads.map(lead => (
                            <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-serif-display italic text-gray-500">
                                        {lead.first_name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-obsidian">{lead.first_name} {lead.last_name}</p>
                                        <p className="text-xs text-gray-400">Submitted a new inquiry</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-sans-tech">
                                    {new Date(lead.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    );
}
