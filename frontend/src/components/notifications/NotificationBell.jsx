import React, { useState, useEffect } from 'react';
import {
  getNotificationsForCurrentUser,
  markNotificationAsRead,
} from '../../services/notificationService';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsForCurrentUser();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (err) {
      console.log('Notification service not connected yet', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none',
          fontSize: '24px', cursor: 'pointer', position: 'relative'
        }}>
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-5px', right: '-5px',
            background: 'red', color: 'var(--text-primary)', borderRadius: '50%',
            width: '18px', height: '18px', fontSize: '11px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '35px',
          width: '300px', background: 'var(--text-primary)', border: '1px solid #ddd',
          borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000, maxHeight: '400px', overflowY: 'auto'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
            🔔 Notifications
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
              No notifications yet
            </div>
          ) : (
            notifications.map(n => (
              <div key={n.id} onClick={() => markAsRead(n.id)}
                style={{
                  padding: '12px 16px', borderBottom: '1px solid #f0f0f0',
                  background: n.read ? 'var(--text-primary)' : '#f0f7ff',
                  cursor: 'pointer'
                }}>
                <div style={{ fontWeight: n.read ? 'normal' : 'bold' }}>{n.type || 'Notification'}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{n.message}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;