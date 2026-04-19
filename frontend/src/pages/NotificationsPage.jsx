import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteNotificationById,
  getNotificationsForCurrentUser,
  getUnreadCountForCurrentUser,
  markAllNotificationsAsReadForCurrentUser,
  markNotificationAsRead,
} from "../services/notificationService";

const typeColors = {
  BOOKING_APPROVED: "#0f766e",
  BOOKING_REJECTED: "#b91c1c",
  BOOKING_CANCELLED: "#9a3412",
  TICKET_UPDATED: "#1d4ed8",
  TICKET_ASSIGNED: "#7c3aed",
  NEW_COMMENT: "#0f766e",
};

const formatTypeLabel = (type) => {
  if (!type) return "General";
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatTimestamp = (value) => {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const [list, unread] = await Promise.all([
        getNotificationsForCurrentUser(),
        getUnreadCountForCurrentUser(),
      ]);
      setNotifications(Array.isArray(list) ? list : []);
      setUnreadCount(unread?.unreadCount || 0);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const emptyState = useMemo(() => {
    if (loading) return "Loading notifications...";
    if (notifications.length === 0) return "You do not have any notifications yet.";
    return "";
  }, [loading, notifications.length]);

  const handleMarkRead = async (notification) => {
    if (!notification?.id || notification.read) return;
    setBusyId(notification.id);

    try {
      await markNotificationAsRead(notification.id);
      await loadNotifications();
    } catch (err) {
      setError(err.message || "Failed to mark notification as read");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    setBusyId(id);

    try {
      await deleteNotificationById(id);
      await loadNotifications();
    } catch (err) {
      setError(err.message || "Failed to delete notification");
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setBulkBusy(true);

    try {
      await markAllNotificationsAsReadForCurrentUser();
      await loadNotifications();
    } catch (err) {
      setError(err.message || "Failed to mark all notifications as read");
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Notification Center</h2>
          <p style={styles.subtext}>Unread: {unreadCount}</p>
        </div>
        <div style={styles.actions}>
          <button type="button" onClick={loadNotifications} style={styles.secondaryBtn} disabled={loading || bulkBusy}>
            Refresh
          </button>
          <button
            type="button"
            onClick={handleMarkAllRead}
            style={styles.primaryBtn}
            disabled={bulkBusy || unreadCount === 0}
          >
            {bulkBusy ? "Updating..." : "Mark All As Read"}
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.listWrap}>
        {emptyState ? (
          <div style={styles.empty}>{emptyState}</div>
        ) : (
          notifications.map((notification) => {
            const typeColor = typeColors[notification.type] || "#334155";
            const isBusy = busyId === notification.id;

            return (
              <article
                key={notification.id}
                style={{
                  ...styles.item,
                  ...(notification.read ? styles.itemRead : styles.itemUnread),
                }}
              >
                <div style={styles.itemTopRow}>
                  <span style={{ ...styles.badge, background: `${typeColor}22`, color: typeColor, borderColor: `${typeColor}66` }}>
                    {formatTypeLabel(notification.type)}
                  </span>
                  <span style={styles.time}>{formatTimestamp(notification.createdAt)}</span>
                </div>

                <p style={styles.message}>{notification.message || "No message provided"}</p>

                <div style={styles.itemActions}>
                  <button
                    type="button"
                    onClick={() => handleMarkRead(notification)}
                    disabled={notification.read || isBusy}
                    style={styles.textBtn}
                  >
                    {notification.read ? "Read" : isBusy ? "Updating..." : "Mark As Read"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notification.id)}
                    disabled={isBusy}
                    style={styles.deleteBtn}
                  >
                    {isBusy ? "Removing..." : "Delete"}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: 24,
    maxWidth: 980,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  title: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: 24,
    fontWeight: 700,
  },
  subtext: {
    margin: "6px 0 0",
    color: "var(--text-secondary)",
    fontSize: 13,
  },
  actions: {
    display: "flex",
    gap: 10,
  },
  primaryBtn: {
    background: "var(--accent-color)",
    color: "var(--bg-sidebar)",
    border: "none",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "var(--bg-card)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    marginBottom: 12,
    background: "#2a0f0f",
    border: "1px solid #7a1f1f",
    color: "#fca5a5",
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 13,
  },
  listWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  empty: {
    background: "var(--bg-card)",
    border: "1px dashed var(--border-color)",
    borderRadius: 12,
    color: "var(--text-secondary)",
    padding: "26px 18px",
    textAlign: "center",
  },
  item: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  itemUnread: {
    borderLeft: "3px solid var(--accent-color)",
  },
  itemRead: {
    opacity: 0.88,
  },
  itemTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  badge: {
    border: "1px solid",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.2px",
  },
  time: {
    color: "var(--text-secondary)",
    fontSize: 12,
  },
  message: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: 14,
    lineHeight: 1.5,
  },
  itemActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
  },
  textBtn: {
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    borderRadius: 8,
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#3a1212",
    border: "1px solid #7a1f1f",
    color: "#fca5a5",
    borderRadius: 8,
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default NotificationsPage;
