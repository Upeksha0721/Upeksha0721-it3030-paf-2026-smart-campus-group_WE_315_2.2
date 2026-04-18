import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import incidentService from '../services/incidentService';

const IncidentList = ({ mode }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ status: '', priority: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const data = await incidentService.getTickets();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus = filter.status === '' || ticket.status === filter.status;
        const matchesPriority = filter.priority === '' || ticket.priority === filter.priority;
        
        if (mode === 'completed') {
            const isCompleted = ['RESOLVED', 'CLOSED', 'REJECTED'].includes(ticket.status);
            return isCompleted && matchesStatus && matchesPriority;
        }
        
        return matchesStatus && matchesPriority;
    });

    const getStatusStyle = (status) => {
        let baseStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', border: '1px solid' };
        switch (status) {
            case 'OPEN': return { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
            case 'IN_PROGRESS': return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
            case 'RESOLVED': return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' };
            case 'CLOSED': return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
            case 'REJECTED': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
            default: return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
        }
    };

    const getPriorityStyle = (priority) => {
        let baseStyle = { fontSize: '10px', fontWeight: 'bold' };
        switch (priority) {
            case 'HIGH': return { ...baseStyle, color: '#ef4444' };
            case 'MEDIUM': return { ...baseStyle, color: '#d97706' };
            case 'LOW': return { ...baseStyle, color: '#10b981' };
            default: return { ...baseStyle, color: '#4b5563' };
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d1b2e' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #1e2d4a', borderTop: '4px solid #f5c400', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '40px', minHeight: '100vh', background: '#0d1b2e', fontFamily: 'Segoe UI, sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                        {mode === 'completed' ? 'Completed Tasks' : 'Incident Tickets'}
                    </h2>
                    {mode !== 'completed' && (
                        <button 
                            onClick={() => navigate('/incidents/create')}
                            style={{ padding: '10px 24px', backgroundColor: '#f5c400', color: '#091A2F', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(245, 196, 0, 0.2)', transition: 'transform 0.1s' }}
                            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            + New Incident
                        </button>
                    )}
                </div>

                {/* Filters Board */}
                <div style={{ backgroundColor: '#122A42', padding: '24px', borderRadius: '12px', border: '1px solid #1A3A5A', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#A0B0C4', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Status</label>
                        <select
                            name="status"
                            value={filter.status}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px 16px', backgroundColor: '#0D2137', border: '1px solid #1A3A5A', color: 'white', borderRadius: '8px', outline: 'none' }}
                        >
                            <option value="">{mode === 'completed' ? 'All Completed' : 'All Statuses'}</option>
                            {mode !== 'completed' && <option value="OPEN">Open</option>}
                            {mode !== 'completed' && <option value="IN_PROGRESS">In Progress</option>}
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#A0B0C4', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Priority</label>
                        <select
                            name="priority"
                            value={filter.priority}
                            onChange={handleFilterChange}
                            style={{ width: '100%', padding: '10px 16px', backgroundColor: '#0D2137', border: '1px solid #1A3A5A', color: 'white', borderRadius: '8px', outline: 'none' }}
                        >
                            <option value="">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                </div>

                {/* List Grid */}
                {filteredTickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: 'rgba(18, 42, 66, 0.5)', borderRadius: '12px', border: '2px dashed #1A3A5A' }}>
                        <p style={{ color: '#A0B0C4', fontSize: '18px', margin: 0 }}>No incident tickets found matching your filters.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {filteredTickets.map((ticket) => (
                            <div 
                                key={ticket.id}
                                onClick={() => navigate(`/incidents/${ticket.id}`)}
                                style={{ backgroundColor: '#111f38', borderRadius: '12px', border: '1px solid #1e2d4a', padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f5c400'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e2d4a'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <span style={getStatusStyle(ticket.status)}>
                                        {ticket.status.replace('_', ' ')}
                                    </span>
                                    <span style={getPriorityStyle(ticket.priority)}>
                                        {ticket.priority} PRIORITY
                                    </span>
                                </div>
                                
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>{ticket.category}</h3>
                                <p style={{ color: '#A0B0C4', fontSize: '14px', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '60px' }}>
                                    {ticket.description}
                                </p>
                                
                                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #1A3A5A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
                                    <span>ID: #{ticket.id}</span>
                                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncidentList;
