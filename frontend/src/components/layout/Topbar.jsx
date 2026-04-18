import React from "react";

function Topbar({ title, role, userName, onLogout }) {
  const displayName = (userName || "Campus User").trim();

  const initials = (userName || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header style={styles.topbar}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>Professional campus operations dashboard</p>
      </div>

      <div style={styles.right}>
        <span style={styles.roleChip}>{role || "USER"}</span>
        <div style={styles.userName}>{displayName}</div>
        <div style={styles.avatar}>{initials}</div>
        <button type="button" onClick={onLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    height: 74,
    background: "var(--bg-card)",
    borderBottom: "1px solid var(--border-color)",
    padding: "0 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: 20,
    fontWeight: 700,
  },
  subtitle: {
    margin: "4px 0 0",
    color: "var(--text-secondary)",
    fontSize: 12,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  roleChip: {
    background: "var(--badge-bg)",
    color: "var(--accent-color)",
    border: "1px solid var(--border-color)",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.4px",
  },
  userName: {
    color: "var(--text-primary)",
    fontSize: 13,
    fontWeight: 700,
    maxWidth: 220,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "var(--bg-input-focus)",
    color: "var(--text-primary)",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border-color)",
  },
  logoutBtn: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 8,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Topbar;
