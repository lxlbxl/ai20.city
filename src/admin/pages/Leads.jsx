import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreVertical, X, Check, Save } from 'lucide-react';

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [noteInput, setNoteInput] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await fetch('/backend/api/leads.php');
            const data = await response.json();
            if (data.status === 'success') {
                setLeads(data.data);
            } else {
                setError('Failed to fetch leads: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            setError('Connection Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateLead = async (id, updates) => {
        try {
            const response = await fetch('/backend/api/leads.php', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates })
            });
            const result = await response.json();
            if (result.status === 'success') {
                setLeads(leads.map(l => l.id === id ? { ...l, ...updates } : l));
                if (selectedLead && selectedLead.id === id) {
                    setSelectedLead({ ...selectedLead, ...updates });
                }
            } else {
                alert('Update failed: ' + result.message);
            }
        } catch (err) {
            alert('Update error: ' + err.message);
        }
    };

    const handleStatusChange = (status) => {
        if (!selectedLead) return;
        updateLead(selectedLead.id, { status });
    };

    const handleConvertToClient = () => {
        if (!selectedLead) return;
        // Logic: Change status to 'client' or specific field? 
        // User asked to "convert to clients". I'll use status='client'.
        updateLead(selectedLead.id, { status: 'client' });
    };

    const handleSaveNote = () => {
        if (!selectedLead) return;
        // Append new note to existing notes with timestamp?
        // Or just replace. The backend replaces.
        // Let's implement append logic here for better UX.
        // But backend just stores text. 
        // I'll format it as: "[Date] Note text\n\nPrevious notes..."
        const timestamp = new Date().toLocaleString();
        const newNoteEntry = `[${timestamp}] ${noteInput}`;
        const updatedNotes = selectedLead.notes ? `${newNoteEntry}\n\n${selectedLead.notes}` : newNoteEntry;

        updateLead(selectedLead.id, { notes: updatedNotes });
        setNoteInput(''); // Clear input
    };

    const handleGenerateRoadmap = async () => {
        if (!selectedLead) return;

        // Optimistic update
        const updatedLead = { ...selectedLead, roadmap_status: 'generating' };
        setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
        setSelectedLead(updatedLead);

        try {
            const response = await fetch('/backend/api/generate-roadmap.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lead_id: selectedLead.id })
            });
            const data = await response.json();

            if (data.status === 'success') {
                const completedLead = {
                    ...selectedLead,
                    roadmap_status: 'completed',
                    roadmap_content: data.data
                };
                setLeads(leads.map(l => l.id === selectedLead.id ? completedLead : l));
                setSelectedLead(completedLead);
            } else {
                alert('Generation failed: ' + data.message);
                const failedLead = { ...selectedLead, roadmap_status: 'failed' };
                setLeads(leads.map(l => l.id === selectedLead.id ? failedLead : l));
                setSelectedLead(failedLead);
            }
        } catch (err) {
            alert('Error: ' + err.message);
            const failedLead = { ...selectedLead, roadmap_status: 'failed' };
            setLeads(leads.map(l => l.id === selectedLead.id ? failedLead : l));
            setSelectedLead(failedLead);
        }
    };

    const filteredLeads = leads.filter(lead =>
        (lead.first_name + ' ' + lead.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="font-serif-display text-4xl italic">Lead Management.</h1>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#050505] text-white hover:bg-[#ff3300] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* List & Detail Split View */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Lead List */}
                <div className={`${selectedLead ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white border border-gray-100 shadow-sm rounded overflow-hidden`}>
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="flex-1 outline-none text-sm font-sans-tech bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-4 font-sans-tech text-[10px] uppercase tracking-widest text-gray-500">Contact</th>
                                    <th className="p-4 font-sans-tech text-[10px] uppercase tracking-widest text-gray-500">Status</th>
                                    <th className="p-4 font-sans-tech text-[10px] uppercase tracking-widest text-gray-500">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading && <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>}
                                {filteredLeads.map(lead => (
                                    <tr
                                        key={lead.id}
                                        onClick={() => setSelectedLead(lead)}
                                        className={`cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-orange-50 border-l-2 border-[#ff3300]' : 'hover:bg-gray-50'}`}
                                    >
                                        <td className="p-4">
                                            <p className="font-medium text-sm text-obsidian">{lead.first_name} {lead.last_name}</p>
                                            <p className="text-xs text-gray-400">{lead.company}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest rounded-full ${lead.status === 'client' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-400">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Lead Detail Panel */}
                {selectedLead ? (
                    <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                            <div>
                                <h2 className="font-serif-display text-2xl mb-1">{selectedLead.first_name} {selectedLead.last_name}</h2>
                                <p className="text-sm text-gray-500">{selectedLead.title} at {selectedLead.company}</p>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="md:hidden p-2 text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Actions Toolbar */}
                            <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-100">
                                <select
                                    value={selectedLead.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="px-3 py-2 bg-white border border-gray-200 rounded text-sm outline-none focus:border-[#ff3300]"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="proposal">Proposal Sent</option>
                                    <option value="client">Client (Won)</option>
                                    <option value="lost">Lost</option>
                                </select>

                                <button
                                    onClick={handleConvertToClient}
                                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-xs uppercase tracking-widest rounded flex items-center gap-2"
                                >
                                    <Check size={14} /> Convert to Client
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs uppercase tracking-widest text-[#ff3300] font-bold">Contact Info</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400 block text-xs">Email</span>
                                            <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-xs">Phone</span>
                                            <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-xs">Location</span>
                                            <span>{selectedLead.location || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block text-xs">Company Size</span>
                                            <span>{selectedLead.company_size || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <h3 className="text-xs uppercase tracking-widest text-[#ff3300] font-bold mb-2">Requirements</h3>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="text-gray-400 block text-xs">Industry</span>
                                                <span>{selectedLead.industry}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-xs">Budget</span>
                                                <span>{selectedLead.budget}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-xs">Timeline</span>
                                                <span>{selectedLead.timeline}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-xs">AI Usage</span>
                                                <span>{selectedLead.ai_usage}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 block text-xs">Challenges</span>
                                                <p className="bg-gray-50 p-2 rounded mt-1 text-gray-700">{selectedLead.challenges}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs uppercase tracking-widest text-[#ff3300] font-bold">Notes & Activity</h3>

                                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded min-h-[150px] text-sm whitespace-pre-wrap font-sans-tech text-gray-700">
                                        {selectedLead.notes || 'No notes yet.'}
                                    </div>

                                    <div className="flex gap-2">
                                        <textarea
                                            placeholder="Add a note..."
                                            className="flex-1 border border-gray-200 p-2 rounded text-sm focus:border-[#ff3300] outline-none resize-none h-20"
                                            value={noteInput}
                                            onChange={(e) => setNoteInput(e.target.value)}
                                        ></textarea>
                                        <button
                                            onClick={handleSaveNote}
                                            disabled={!noteInput.trim()}
                                            className="px-4 bg-[#050505] text-white hover:bg-[#ff3300] disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors rounded flex items-center justify-center"
                                        >
                                            <Save size={18} />
                                        </button>
                                    </div>

                                    {/* AI Roadmap Section */}
                                    <div className="pt-6 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xs uppercase tracking-widest text-[#ff3300] font-bold flex items-center gap-1">
                                                <span>⚡</span> AI Roadmap
                                            </h3>
                                            <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${selectedLead.roadmap_status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    selectedLead.roadmap_status === 'generating' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-500'
                                                }`}>
                                                {selectedLead.roadmap_status || 'Pending'}
                                            </span>
                                        </div>

                                        {selectedLead.roadmap_status === 'completed' ? (
                                            <div className="space-y-2">
                                                <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 h-96 overflow-y-auto font-sans-tech border border-gray-200">
                                                    {selectedLead.roadmap_content}
                                                </div>
                                                <button
                                                    onClick={() => handleGenerateRoadmap()}
                                                    className="w-full py-2 border border-gray-200 text-gray-500 text-xs uppercase tracking-widest hover:border-[#ff3300] hover:text-[#ff3300] transition-colors"
                                                >
                                                    Regenerate
                                                </button>
                                            </div>
                                        ) : selectedLead.roadmap_status === 'generating' ? (
                                            <div className="bg-gray-50 p-8 rounded text-center border border-dashed border-gray-200">
                                                <div className="animate-spin w-6 h-6 border-2 border-[#ff3300] border-t-transparent rounded-full mx-auto mb-2"></div>
                                                <p className="text-xs text-gray-500">Generating AI Roadmap...</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleGenerateRoadmap}
                                                className="w-full py-3 bg-gradient-to-r from-[#050505] to-[#333] text-white hover:from-[#ff3300] hover:to-[#ff5500] transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded shadow-sm"
                                            >
                                                <span>⚡</span> Generate Roadmap
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 bg-gray-50 border border-gray-100 border-dashed rounded items-center justify-center text-gray-400">
                        Select a lead to view details
                    </div>
                )}
            </div>
        </div>
    );
}
