import axios from 'axios';

const BASE_URL = 'http://localhost:8084/api/bookings';

const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// Get all bookings (Admin)
export const getAllBookings = () =>
    axios.get(BASE_URL, getHeaders());

// Get bookings by user ID
export const getMyBookings = (userId) =>
    axios.get(`${BASE_URL}/user/${userId}`, getHeaders());

// Get single booking by ID
export const getBookingById = (id) =>
    axios.get(`${BASE_URL}/${id}`, getHeaders());

// Create new booking
export const createBooking = (data) =>
    axios.post(BASE_URL, data, getHeaders());

// Approve a booking (Admin)
export const approveBooking = (id) =>
    axios.put(`${BASE_URL}/${id}/approve`, {}, getHeaders());

// Reject a booking with reason (Admin)
export const rejectBooking = (id, reason) =>
    axios.put(`${BASE_URL}/${id}/reject`, { reason }, getHeaders());

// Cancel an approved booking (User)
export const cancelBooking = (id) =>
    axios.put(`${BASE_URL}/${id}/cancel`, {}, getHeaders());

// Delete a booking (Admin)
export const deleteBooking = (id) =>
    axios.delete(`${BASE_URL}/${id}`, getHeaders());
