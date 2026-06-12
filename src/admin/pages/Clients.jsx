import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, LayoutGrid, List, MoreVertical, X, FolderPlus, Folder, Check, AlertCircle } from 'lucide-react';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [projects, setProjects] = useState([]);
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [newClient, setNewClient] = useState({ firstName: '', lastName: '', email: '', company: '', productInterest: '' });
    const [newProject, setNewProject] = useState({ name: '', status: 'active', description: '', product: '' });
    const [showAddProject, setShowAddProject] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('/backend/api/clients.php');
            const data = await response.json();
            if (data.status === 'success') setClients(data.data);
            else setError(data.message);
        } catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    const fetchProjects = async (clientId) => {
        try {
            const response = await fetch(`/backend/api/projects.php?client_id=${clientId}`);
            const data = await response.json();
            if (data.status === 'success') setProjects(data.data);
        } catch (err) { console.error(err); }
    };

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        fetchProjects(client.id);
        setShowAddProject(false);
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/backend/api/clients.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            });
            const data = await response.json();
            if (data.status === 'success') {
                fetchClients();
                setShowAddClientModal(false);
                setNewClient({ firstName: '', lastName: '', email: '', company: '', productInterest: '' });
            } else alert(data.message);
        } catch (err) { alert(err.message); }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!selectedClient) return;
        try {
            const response = await fetch('/backend/api/projects.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newProject, client_id: selectedClient.id })
            });
            const data = await response.json();
            if (data.status === 'success') {
                fetchProjects(selectedClient.id);
                setNewProject({ name: '', status: 'active', description: '', product: '' });
                setShowAddProject(false);
            } else alert(data.message);
        } catch (err) { alert(err.message); }
    };

    // Simple filter
    const filteredClients = clients.filter(c =>
        c.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="font-serif-display text-4xl italic">Client Management.</h1>
                <button
                    onClick={() => setShowAddClientModal(true)}
                    className="px-4 py-2 bg-[#050505] text-white hover:bg-[#ff3300] transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
                >
                    <Plus size={14} /> Add Client
                </button>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Client List */}
                <div className={`${selectedClient ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white border border-gray-100 shadow-sm rounded overflow-hidden`}>
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                        <Search size={16} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="flex-1 outline-none text-sm font-sans-tech bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-gray-50">
                            {filteredClients.map(client => (
                                <div
                                    key={client.id}
                                    onClick={() => handleSelectClient(client)}
                                    className={`p-4 cursor-pointer transition-colors ${selectedClient?.id === client.id ? 'bg-orange-50 border-l-2 border-[#ff3300]' : 'hover:bg-gray-50'}`}
                                >
                                    <h3 className="font-medium text-sm text-obsidian">{client.first_name} {client.last_name}</h3>
                                    <p className="text-xs text-gray-500">{client.company}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                            {client.product_interest || 'General'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Client Detail */}
                {selectedClient ? (
                    <div className="flex-[2] bg-white border border-gray-100 shadow-sm rounded flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                            <div>
                                <h2 className="font-serif-display text-3xl mb-1">{selectedClient.first_name} {selectedClient.last_name}</h2>
                                <p className="text-sm text-gray-500">{selectedClient.company} • {selectedClient.email}</p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} className="md:hidden text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Projects Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs uppercase tracking-widest text-[#ff3300] font-bold flex items-center gap-2">
                                        <Folder size={16} /> Active Projects
                                    </h3>
                                    <button
                                        onClick={() => setShowAddProject(!showAddProject)}
                                        className="text-xs uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-1"
                                    >
                                        <FolderPlus size={14} /> New Project
                                    </button>
                                </div>

                                {showAddProject && (
                                    <form onSubmit={handleAddProject} className="bg-gray-50 p-4 rounded mb-6 border border-gray-100">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <input className="p-2 border rounded text-sm" placeholder="Project Name" value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} required />
                                            <select className="p-2 border rounded text-sm" value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value })}>
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="hold">On Hold</option>
                                            </select>
                                        </div>
                                        <input className="w-full p-2 border rounded text-sm mb-4" placeholder="Product / Service Type" value={newProject.product} onChange={e => setNewProject({ ...newProject, product: e.target.value })} />
                                        <textarea className="w-full p-2 border rounded text-sm mb-4 h-20" placeholder="Description" value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowAddProject(false)} className="px-3 py-1 text-xs uppercase hover:bg-gray-200 rounded">Cancel</button>
                                            <button type="submit" className="px-3 py-1 bg-[#050505] text-white text-xs uppercase rounded">Create Project</button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {projects.length === 0 && !showAddProject && (
                                        <div className="col-span-2 text-center py-8 text-gray-400 text-sm border border-dashed rounded">
                                            No active projects found.
                                        </div>
                                    )}
                                    {projects.map(project => (
                                        <div key={project.id} className="border border-gray-200 p-4 rounded hover:border-[#ff3300] transition-colors group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-obsidian">{project.name}</h4>
                                                <span className={`px-2 py-0.5 text-[10px] uppercase rounded-full ${project.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-2">{project.product}</p>
                                            <p className="text-sm text-gray-700">{project.description}</p>
                                            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-xs text-gray-400">
                                                <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-[2] items-center justify-center text-gray-400 border border-gray-100 border-dashed rounded bg-gray-50">
                        Select a client to view details
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            {showAddClientModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded max-w-md w-full p-6 shadow-xl">
                        <h2 className="font-serif-display text-2xl mb-4">Add New Client</h2>
                        <form onSubmit={handleAddClient} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input className="p-2 border rounded text-sm w-full" placeholder="First Name" value={newClient.firstName} onChange={e => setNewClient({ ...newClient, firstName: e.target.value })} required />
                                <input className="p-2 border rounded text-sm w-full" placeholder="Last Name" value={newClient.lastName} onChange={e => setNewClient({ ...newClient, lastName: e.target.value })} required />
                            </div>
                            <input className="p-2 border rounded text-sm w-full" type="email" placeholder="Email Address" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} required />
                            <input className="p-2 border rounded text-sm w-full" placeholder="Company Name" value={newClient.company} onChange={e => setNewClient({ ...newClient, company: e.target.value })} />
                            <input className="p-2 border rounded text-sm w-full" placeholder="Product Interest (e.g. Chatbot)" value={newClient.productInterest} onChange={e => setNewClient({ ...newClient, productInterest: e.target.value })} />

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowAddClientModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#ff3300] text-white text-sm rounded hover:bg-[#cc2900]">Add Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
