import React, { useState, useEffect } from 'react';
import * as bookingService from '../services/bookingService';

function BookingStaffPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch only APPROVED bookings as staff only need to know what's confirmed
      const bookingsData = await bookingService.getAllBookings({ status: 'APPROVED' });
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-primary)' }}>Loading schedule...</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 700, margin: 0 }}>Facility Booking Schedule</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>View upcoming approved bookings to coordinate maintenance and setups.</p>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Facility', 'Date & Time', 'User', 'Purpose', 'Requirements'].map(h => (
                <th key={h} style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', padding: '16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>No upcoming bookings scheduled.</td>
              </tr>
            ) : bookings.map(b => (
              <tr key={b.id}>
                <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600 }}>{b.resourceName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.resourceType}</div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-primary)' }}>{b.bookingDate}</div>
                  <div style={{ fontSize: 11 }}>{b.startTime} - {b.endTime}</div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                  <div>{b.userName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.expectedAttendees} Attendees</div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>{b.purpose}</td>
                <td style={{ padding: '16px', color: 'var(--accent-color)', borderBottom: '1px solid var(--border-color)', fontSize: 12 }}>
                  {b.needsProjector && <div>• Projector</div>}
                  {b.needsWhiteboard && <div>• Whiteboard</div>}
                  {!b.needsProjector && !b.needsWhiteboard && <div style={{ color: 'var(--text-secondary)' }}>None</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingStaffPage;
