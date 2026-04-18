import React, { useState, useEffect } from 'react';
import * as bookingService from '../services/bookingService';

function BookingAdminPage() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsData, statsData] = await Promise.all([
        bookingService.getAllBookings(),
        bookingService.getBookingStats()
      ]);
      setBookings(bookingsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await bookingService.approveBooking(id);
      fetchData();
    } catch (err) {
      alert('Error approving booking. It may conflict with another approved booking.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason !== null) {
      try {
        await bookingService.rejectBooking(id, reason);
        fetchData();
      } catch (err) {
        alert('Error rejecting booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return { bg: '#0F4A2A', color: 'var(--success-color)' };
      case 'PENDING': return { bg: '#3D2A00', color: 'var(--accent-color)' };
      case 'REJECTED': return { bg: 'var(--danger-border)', color: 'var(--danger-color)' };
      case 'CANCELLED': return { bg: 'var(--border-color)', color: 'var(--text-secondary)' };
      default: return { bg: 'var(--border-color)', color: 'var(--text-primary)' };
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-primary)' }}>Loading bookings...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 700, margin: 0 }}>Booking Requests Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Review and manage facility booking requests across the campus.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          ['Pending Requests', stats.pending, 'var(--accent-color)'],
          ['Approved', stats.approved, 'var(--success-color)'],
          ['Rejected', stats.rejected, 'var(--danger-color)'],
          ['Cancelled', stats.cancelled, 'var(--text-secondary)']
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 16, borderTop: '3px solid ' + color }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
            <div style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['ID', 'User', 'Facility', 'Date & Time', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', padding: '16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No bookings found.</td>
              </tr>
            ) : bookings.map(b => {
              const colors = getStatusColor(b.status);
              return (
                <tr key={b.id}>
                  <td style={{ padding: '16px', color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>#{b.id}</td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                    <div>{b.userName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.userId}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600 }}>{b.resourceName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.resourceType}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-primary)' }}>{b.bookingDate}</div>
                    <div style={{ fontSize: 11 }}>{b.startTime} - {b.endTime}</div>
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ background: colors.bg, color: colors.color, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    {b.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleApprove(b.id)} style={{ background: '#0F4A2A', color: 'var(--success-color)', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                          Approve
                        </button>
                        <button onClick={() => handleReject(b.id)} style={{ background: 'var(--danger-border)', color: 'var(--danger-color)', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingAdminPage;
