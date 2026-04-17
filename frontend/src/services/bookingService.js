const BASE_URL = "http://localhost:8084/api/bookings";

export const getAllBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.userId) params.append("userId", filters.userId);
  if (filters.status) params.append("status", filters.status);
  if (filters.bookingDate) params.append("bookingDate", filters.bookingDate);
  if (filters.resourceName) params.append("resourceName", filters.resourceName);

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

export const getBookingStats = async () => {
  const response = await fetch(`${BASE_URL}/stats`);
  if (!response.ok) throw new Error("Failed to fetch booking stats");
  return response.json();
};

export const getBookingById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to fetch booking");
  return response.json();
};

export const getBookingsByUser = async (userId) => {
  const response = await fetch(`${BASE_URL}/user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch user bookings");
  return response.json();
};

export const createBooking = async (bookingData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error("Failed to create booking");
  return response.json();
};

export const approveBooking = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/approve`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to approve booking");
  return response.json();
};

export const rejectBooking = async (id, reason) => {
  const response = await fetch(`${BASE_URL}/${id}/reject`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) throw new Error("Failed to reject booking");
  return response.json();
};

export const cancelBooking = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/cancel`, {
    method: "PATCH",
  });
  if (!response.ok) throw new Error("Failed to cancel booking");
  return response.json();
};

export const deleteBooking = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete booking");
  return true;
};
