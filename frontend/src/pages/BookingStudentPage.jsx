import React, { useState, useEffect } from 'react';
import * as bookingService from '../services/bookingService';
import * as facilityService from '../services/facilityService';

function BookingStudentPage() {
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: 'Other',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: 1,
    needsProjector: false,
    needsWhiteboard: false,
  });

  const userId = localStorage.getItem('userId') || 'user123';
  const userName = localStorage.getItem('userName') || 'Student User';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch separately so one failure doesn't block the other
      const bookingsData = await bookingService.getBookingsByUser(userId).catch(err => {
        console.error('Booking service error:', err);
        return [];
      });
      
      const facilitiesData = await facilityService.getAllFacilities().catch(err => {
        console.error('Facility service error:', err);
        return [];
      });

      setBookings(bookingsData);
      setFacilities(facilitiesData);
    } catch (err) {
      console.error('Error in fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFacilityChange = (e) => {
    const val = e.target.value;
    const facility = facilities.find(f => f.name === val);
    setFormData(prev => ({
      ...prev,
      resourceName: val,
      resourceType: facility ? facility.type : 'Other'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        userId,
        userName,
        expectedAttendees: parseInt(formData.expectedAttendees, 10)
      };
      await bookingService.createBooking(payload);
      setShowForm(false);
      fetchData(); // refresh list
      // Reset form
      setFormData({
        resourceName: '',
        resourceType: 'Other',
        bookingDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: 1,
        needsProjector: false,
        needsWhiteboard: false,
      });
    } catch (err) {
      alert('Error creating booking. Time might conflict or invalid inputs.');
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        fetchData();
      } catch (err) {
        alert('Error canceling booking');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 24, fontWeight: 700, margin: 0 }}>My Bookings</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Manage your facility and resource reservations</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: 'var(--accent-color)', color: 'var(--bg-app)', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel Request' : '+ New Booking'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <h3 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: 20 }}>Request New Booking</h3>

          {/* Facility Catalog */}
          <div style={{ marginBottom: 28, padding: 16, background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: 12 }}>Available Facilities (Click to Select)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
              {facilities.filter(f => f.status === 'ACTIVE').map(f => (
                <div 
                  key={f.id} 
                  onClick={() => setFormData(prev => ({...prev, resourceName: f.name, resourceType: f.type}))}
                  style={{ 
                    background: formData.resourceName === f.name ? 'var(--bg-card)' : 'var(--bg-app)', 
                    border: formData.resourceName === f.name ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', 
                    borderRadius: 8, padding: 12, cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                >
                  <div style={{ color: formData.resourceName === f.name ? 'var(--accent-color)' : 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}>Type: {f.type} | Cap: {f.capacity}</div>
                  <div style={{ color: 'var(--success-color)', fontSize: 11 }}>Available: {f.availabilityStart} - {f.availabilityEnd}</div>
                </div>
              ))}
              {facilities.filter(f => f.status === 'ACTIVE').length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>No facilities available.</div>}
            </div>

            <h4 style={{ color: 'var(--text-primary)', marginTop: 0, marginBottom: 12 }}>Unavailable Facilities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {facilities.filter(f => f.status !== 'ACTIVE').map(f => (
                <div key={f.id} style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 8, padding: 12, opacity: 0.8 }}>
                  <div style={{ color: 'var(--danger-color)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{f.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 11, marginBottom: 4 }}>Type: {f.type}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 11 }}>Note: {f.description || 'Currently out of service for repair or other reasons.'}</div>
                </div>
              ))}
              {facilities.filter(f => f.status !== 'ACTIVE').length === 0 && <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>None.</div>}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={S.label}>Facility / Resource</label>
              {facilities.length > 0 ? (
                <select required name="resourceName" value={formData.resourceName} onChange={handleFacilityChange} style={S.input}>
                  <option value="">Select an active facility from above or list</option>
                  {facilities.filter(f => f.status === 'ACTIVE').map(f => (
                    <option key={f.id} value={f.name}>{f.name} ({f.type})</option>
                  ))}
                </select>
              ) : (
                <input required type="text" name="resourceName" placeholder="E.g. Room 101" value={formData.resourceName} onChange={handleChange} style={S.input} />
              )}
            </div>

            <div>
              <label style={S.label}>Date</label>
              <input required type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} style={S.input} />
            </div>

            <div>
              <label style={S.label}>Purpose</label>
              <input required type="text" name="purpose" placeholder="E.g. Study group" value={formData.purpose} onChange={handleChange} style={S.input} />
            </div>

            <div>
              <label style={S.label}>Start Time</label>
              <input required type="time" name="startTime" value={formData.startTime} onChange={handleChange} style={S.input} />
            </div>

            <div>
              <label style={S.label}>End Time</label>
              <input required type="time" name="endTime" value={formData.endTime} onChange={handleChange} style={S.input} />
            </div>

            <div>
              <label style={S.label}>Expected Attendees</label>
              <input required type="number" min="1" name="expectedAttendees" value={formData.expectedAttendees} onChange={handleChange} style={S.input} />
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <label style={{ color: 'var(--text-primary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" name="needsProjector" checked={formData.needsProjector} onChange={handleChange} />
                Needs Projector
              </label>
              <label style={{ color: 'var(--text-primary)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" name="needsWhiteboard" checked={formData.needsWhiteboard} onChange={handleChange} />
                Needs Whiteboard
              </label>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
              <button type="submit" style={{ background: 'var(--accent-color)', color: 'var(--bg-app)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Facility', 'Date & Time', 'Purpose', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', padding: '16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>You have no bookings yet.</td>
              </tr>
            ) : bookings.map(b => {
              const colors = getStatusColor(b.status);
              return (
                <tr key={b.id}>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600 }}>{b.resourceName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.resourceType}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-primary)' }}>{b.bookingDate}</div>
                    <div style={{ fontSize: 11 }}>{b.startTime} - {b.endTime}</div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>{b.purpose}</td>
                  <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    <span style={{ background: colors.bg, color: colors.color, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {b.status}
                    </span>
                    {b.status === 'REJECTED' && b.rejectionReason && (
                      <div style={{ fontSize: 11, color: 'var(--danger-color)', marginTop: 4 }}>Reason: {b.rejectionReason}</div>
                    )}
                  </td>
                  <td style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                    {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                      <button onClick={() => handleCancel(b.id)} style={{ background: 'transparent', color: 'var(--danger-color)', border: '1px solid var(--danger-color)', padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>
                        Cancel
                      </button>
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

const S = {
  label: { display: 'block', color: 'var(--text-secondary)', fontSize: 12, marginBottom: 6 },
  input: { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, boxSizing: 'border-box' }
};

export default BookingStudentPage;
