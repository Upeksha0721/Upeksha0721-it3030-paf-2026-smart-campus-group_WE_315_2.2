import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import incidentService from '../services/incidentService';
import CommentSection from '../components/CommentSection';
import axios from 'axios';

const IncidentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [statusData, setStatusData] = useState({ status: '', reason: '', resolutionNotes: '' });
    const [techId, setTechId] = useState('');
    const [technicians, setTechnicians] = useState([]);

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        type: '',
        title: '',
        message: ''
    });

    const [actionLoading, setActionLoading] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 2500);
    };

    const openConfirmModal = (type, title, message) => {
        setConfirmModal({
            open: true,
            type,
            title,
            message
        });
    };

    const closeConfirmModal = () => {
        if (actionLoading) return;
        setConfirmModal({
            open: false,
            type: '',
            title: '',
            message: ''
        });
    };

    const fetchTicket = useCallback(async () => {
        try {
            const data = await incidentService.getTicketById(id);
            setTicket(data);
            setStatusData(prev => ({ ...prev, status: data.status }));
        } catch (error) {
            console.error('Error fetching ticket:', error);
            showToast('Failed to load ticket details.', 'error');
            navigate('/incidents');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    email: decoded.sub,
                    role: decoded.role.startsWith('ROLE_') ? decoded.role : `ROLE_${decoded.role}`
                });
            } catch (e) {
                console.error('Error decoding token', e);
            }
        }
        fetchTicket();
    }, [fetchTicket]);

    const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

    useEffect(() => {
        if (isAdmin) {
            const fetchTechnicians = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:8081/api/auth/users', {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    const techs = response.data.filter(
                        u => u.role === 'TECHNICIAN' || u.role === 'ROLE_TECHNICIAN'
                    );
                    setTechnicians(techs);
                } catch (error) {
                    console.error('Error fetching technicians:', error);
                    showToast('Failed to load technicians.', 'error');
                }
            };
            fetchTechnicians();
        }
    }, [isAdmin]);

    const handleStatusUpdateClick = () => {
        openConfirmModal(
            'status',
            'Update Status',
            'Are you sure you want to update the status of this ticket?'
        );
    };

    const handleAssignClick = () => {
        if (!techId) {
            showToast('Please select a technician first.', 'error');
            return;
        }

        openConfirmModal(
            'assign',
            'Assign Technician',
            'Are you sure you want to assign this technician to the ticket?'
        );
    };

    const handleConfirmAction = async () => {
        try {
            setActionLoading(true);

            if (confirmModal.type === 'status') {
                await incidentService.updateStatus(id, statusData);
                showToast('Status updated successfully.');
                await fetchTicket();
            }

            if (confirmModal.type === 'assign') {
                await incidentService.assignTechnician(id, techId);
                showToast('Technician assigned successfully.');
                await fetchTicket();
                setTechId('');
            }

            closeConfirmModal();
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Something went wrong.';

            if (confirmModal.type === 'status') {
                showToast(`Failed to update status: ${message}`, 'error');
            }

            if (confirmModal.type === 'assign') {
                showToast(`Failed to assign technician: ${message}`, 'error');
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: '#0d1b2e'
                }}
            >
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid #1e2d4a',
                        borderTop: '4px solid #f5c400',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}
                >
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding: '80px',
                    color: '#64748b',
                    background: '#0d1b2e',
                    minHeight: '100vh'
                }}
            >
                Ticket not found
            </div>
        );
    }

    const isTechnician = user?.role === 'ROLE_TECHNICIAN' || user?.role === 'TECHNICIAN';
    const isAssignedTech = isTechnician && user?.email === ticket.assignedTechnicianId;

    return (
        <>
            <div
                style={{
                    padding: '40px 20px',
                    minHeight: '100vh',
                    background: '#0d1b2e',
                    fontFamily: 'Segoe UI, sans-serif'
                }}
            >
                <div
                    style={{
                        maxWidth: '1000px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#122A42',
                            borderRadius: '24px',
                            border: '1px solid #1A3A5A',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            style={{
                                background: 'linear-gradient(to right, #1A3A5A, #0D2137)',
                                padding: '32px',
                                color: 'white',
                                borderBottom: '1px solid #1A3A5A',
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '16px'
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        color: '#bfdbfe',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        margin: '0 0 8px 0'
                                    }}
                                >
                                    Ticket #{ticket.id}
                                </p>
                                <h2 style={{ fontSize: '36px', fontWeight: '800', margin: 0 }}>
                                    {ticket.category}
                                </h2>
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                {ticket.status.replace('_', ' ')}
                            </div>
                        </div>

                        <div
                            style={{
                                padding: '32px',
                                display: 'grid',
                                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                                gap: '32px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            margin: '0 0 8px 0'
                                        }}
                                    >
                                        Description
                                    </h3>
                                    <p
                                        style={{
                                            color: '#A0B0C4',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap',
                                            margin: 0
                                        }}
                                    >
                                        {ticket.description}
                                    </p>
                                </div>

                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                margin: '0 0 16px 0'
                                            }}
                                        >
                                            Attachments
                                        </h3>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                                gap: '16px'
                                            }}
                                        >
                                            {ticket.attachments.map((att) => (
                                                <a
                                                    key={att.id}
                                                    href={att.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{
                                                        display: 'block',
                                                        height: '120px',
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        border: '1px solid #1e2d4a',
                                                        position: 'relative'
                                                    }}
                                                >
                                                    <img
                                                        src={att.fileUrl}
                                                        alt="Attachment"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {ticket.rejectionReason && (
                                    <div
                                        style={{
                                            padding: '16px',
                                            backgroundColor: '#450a0a',
                                            border: '1px solid #7f1d1d',
                                            borderRadius: '16px'
                                        }}
                                    >
                                        <h4
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#fca5a5',
                                                margin: '0 0 4px 0',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ marginRight: '8px' }}>⚠️</span>
                                            Rejection Reason
                                        </h4>
                                        <p style={{ color: '#f87171', margin: 0 }}>
                                            {ticket.rejectionReason}
                                        </p>
                                    </div>
                                )}

                                {ticket.resolutionNotes && (
                                    <div
                                        style={{
                                            padding: '16px',
                                            backgroundColor: '#064e3b',
                                            border: '1px solid #065f46',
                                            borderRadius: '16px'
                                        }}
                                    >
                                        <h4
                                            style={{
                                                fontWeight: 'bold',
                                                color: '#6ee7b7',
                                                margin: '0 0 4px 0',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ marginRight: '8px' }}>✅</span>
                                            Resolution Notes
                                        </h4>
                                        <p style={{ color: '#34d399', margin: 0 }}>
                                            {ticket.resolutionNotes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#0D2137',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        border: '1px solid #1A3A5A',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px'
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            color: '#f5c400',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            margin: 0
                                        }}
                                    >
                                        Details
                                    </h3>

                                    <div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                margin: '0 0 4px 0'
                                            }}
                                        >
                                            Reporter
                                        </p>
                                        <p style={{ color: 'white', fontWeight: '500', margin: 0 }}>
                                            {ticket.userId}
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                margin: '0 0 4px 0'
                                            }}
                                        >
                                            Contact
                                        </p>
                                        <p style={{ color: 'white', fontWeight: '500', margin: 0 }}>
                                            {ticket.contactDetails}
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                margin: '0 0 4px 0'
                                            }}
                                        >
                                            Technician
                                        </p>
                                        <p
                                            style={{
                                                color: ticket.assignedTechnicianId ? 'white' : '#64748b',
                                                fontStyle: ticket.assignedTechnicianId ? 'normal' : 'italic',
                                                fontWeight: '500',
                                                margin: 0
                                            }}
                                        >
                                            {ticket.assignedTechnicianId || 'Not Assigned'}
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: '#64748b',
                                                margin: '0 0 4px 0'
                                            }}
                                        >
                                            Priority
                                        </p>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 'bold',
                                                ...(ticket.priority === 'HIGH'
                                                    ? {
                                                          color: '#fca5a5',
                                                          backgroundColor: 'rgba(127,29,29,0.3)',
                                                          border: '1px solid #7f1d1d'
                                                      }
                                                    : ticket.priority === 'MEDIUM'
                                                    ? {
                                                          color: '#fde047',
                                                          backgroundColor: 'rgba(113,63,18,0.3)',
                                                          border: '1px solid #713f12'
                                                      }
                                                    : {
                                                          color: '#86efac',
                                                          backgroundColor: 'rgba(20,83,45,0.3)',
                                                          border: '1px solid #14532d'
                                                      })
                                            }}
                                        >
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>

                                {(isAdmin || isAssignedTech) && (
                                    <div
                                        style={{
                                            backgroundColor: '#122A42',
                                            padding: '24px',
                                            borderRadius: '16px',
                                            border: '2px solid #1A3A5A',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px'
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: '#f5c400',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                margin: 0
                                            }}
                                        >
                                            Update Status
                                        </h3>

                                        <select
                                            value={statusData.status}
                                            onChange={(e) =>
                                                setStatusData({ ...statusData, status: e.target.value })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                backgroundColor: '#0D2137',
                                                border: '1px solid #1A3A5A',
                                                color: 'white',
                                                borderRadius: '12px',
                                                outline: 'none'
                                            }}
                                        >
                                            <option value="OPEN">Open</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="RESOLVED">Resolved</option>
                                            <option value="CLOSED">Closed</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>

                                        {statusData.status === 'REJECTED' && (
                                            <textarea
                                                placeholder="Reason for rejection..."
                                                value={statusData.reason}
                                                onChange={(e) =>
                                                    setStatusData({ ...statusData, reason: e.target.value })
                                                }
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    backgroundColor: '#0D2137',
                                                    border: '1px solid #1A3A5A',
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    outline: 'none',
                                                    resize: 'vertical'
                                                }}
                                                rows="3"
                                            />
                                        )}

                                        {statusData.status === 'RESOLVED' && (
                                            <textarea
                                                placeholder="Resolution notes..."
                                                value={statusData.resolutionNotes}
                                                onChange={(e) =>
                                                    setStatusData({
                                                        ...statusData,
                                                        resolutionNotes: e.target.value
                                                    })
                                                }
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    backgroundColor: '#0D2137',
                                                    border: '1px solid #1A3A5A',
                                                    color: 'white',
                                                    borderRadius: '12px',
                                                    outline: 'none',
                                                    resize: 'vertical'
                                                }}
                                                rows="3"
                                            />
                                        )}

                                        <button
                                            onClick={handleStatusUpdateClick}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                backgroundColor: '#f5c400',
                                                color: '#091A2F',
                                                fontWeight: 'bold',
                                                border: 'none',
                                                borderRadius: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Update Status
                                        </button>
                                    </div>
                                )}

                                {isAdmin && (
                                    <div
                                        style={{
                                            backgroundColor: '#122A42',
                                            padding: '24px',
                                            borderRadius: '16px',
                                            border: '2px solid #1A3A5A',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px'
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                color: '#f5c400',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                margin: 0
                                            }}
                                        >
                                            Assign Technician
                                        </h3>

                                        <select
                                            value={techId}
                                            onChange={(e) => setTechId(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                backgroundColor: '#0D2137',
                                                border: '1px solid #1A3A5A',
                                                color: 'white',
                                                borderRadius: '12px',
                                                outline: 'none',
                                                appearance: 'auto'
                                            }}
                                        >
                                            <option value="">Select Technician...</option>
                                            {technicians.map((tech) => (
                                                <option key={tech.id} value={tech.email}>
                                                    {tech.name} ({tech.email})
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            onClick={handleAssignClick}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                backgroundColor: '#f5c400',
                                                color: '#091A2F',
                                                fontWeight: 'bold',
                                                border: 'none',
                                                borderRadius: '12px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Assign
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <CommentSection
                        ticketId={id}
                        initialComments={ticket.comments}
                        currentUserEmail={user?.email}
                    />
                </div>
            </div>

            {confirmModal.open && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        padding: '20px'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '420px',
                            backgroundColor: '#122A42',
                            border: '1px solid #1A3A5A',
                            borderRadius: '20px',
                            padding: '28px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.35)'
                        }}
                    >
                        <h3
                            style={{
                                margin: '0 0 12px 0',
                                color: 'white',
                                fontSize: '22px',
                                fontWeight: '700'
                            }}
                        >
                            {confirmModal.title}
                        </h3>

                        <p
                            style={{
                                margin: '0 0 24px 0',
                                color: '#cbd5e1',
                                lineHeight: '1.6'
                            }}
                        >
                            {confirmModal.message}
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px'
                            }}
                        >
                            <button
                                onClick={closeConfirmModal}
                                disabled={actionLoading}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: '#1e2d4a',
                                    color: '#cbd5e1',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmAction}
                                disabled={actionLoading}
                                style={{
                                    padding: '10px 18px',
                                    backgroundColor: '#f5c400',
                                    color: '#091A2F',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                }}
                            >
                                {actionLoading ? 'Please wait...' : 'OK'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast.show && (
                <div
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        zIndex: 10000,
                        minWidth: '260px',
                        maxWidth: '360px',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '600',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        backgroundColor: toast.type === 'error' ? '#b91c1c' : '#065f46',
                        border: toast.type === 'error' ? '1px solid #ef4444' : '1px solid #10b981'
                    }}
                >
                    {toast.message}
                </div>
            )}
        </>
    );
};

export default IncidentDetails;