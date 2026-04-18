import { getUserByEmail } from "./userService";

const BASE_URL = "http://localhost:8086/api/notifications";

const getAuthHeaders = (withJson = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
  };

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const parseJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const parseResponse = async (response, fallbackMessage) => {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  let detail = "";
  try {
    const body = await response.json();
    detail = body?.message || body?.error || "";
  } catch {
    detail = "";
  }

  throw new Error(detail || fallbackMessage);
};

export const resolveCurrentUserId = async () => {
  const cached = localStorage.getItem("userId");
  if (cached && !Number.isNaN(Number(cached))) {
    return Number(cached);
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You are not logged in.");
  }

  const payload = parseJwtPayload(token);
  const email = localStorage.getItem("userName") || payload?.sub;

  if (payload?.role && !localStorage.getItem("role")) {
    localStorage.setItem("role", payload.role);
  }
  if (email && !localStorage.getItem("userName")) {
    localStorage.setItem("userName", email);
  }

  if (!email) {
    throw new Error("Unable to resolve user email from your session.");
  }

  const user = await getUserByEmail(email);
  if (!user?.id) {
    throw new Error("Unable to resolve current user profile.");
  }

  localStorage.setItem("userId", String(user.id));
  return user.id;
};

export const getNotificationsForCurrentUser = async () => {
  const userId = await resolveCurrentUserId();
  const response = await fetch(`${BASE_URL}/user/${userId}`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response, "Failed to load notifications");
};

export const getUnreadCountForCurrentUser = async () => {
  const userId = await resolveCurrentUserId();
  const response = await fetch(`${BASE_URL}/user/${userId}/unread-count`, {
    headers: getAuthHeaders(),
  });
  return parseResponse(response, "Failed to load unread notification count");
};

export const markNotificationAsRead = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return parseResponse(response, "Failed to mark notification as read");
};

export const markAllNotificationsAsReadForCurrentUser = async () => {
  const userId = await resolveCurrentUserId();
  const response = await fetch(`${BASE_URL}/user/${userId}/read-all`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return parseResponse(response, "Failed to mark all notifications as read");
};

export const deleteNotificationById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return parseResponse(response, "Failed to delete notification");
};

export const createNotificationForCurrentUser = async ({ type, message }) => {
  const userId = await resolveCurrentUserId();
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ userId, type, message }),
  });
  return parseResponse(response, "Failed to create notification");
};
