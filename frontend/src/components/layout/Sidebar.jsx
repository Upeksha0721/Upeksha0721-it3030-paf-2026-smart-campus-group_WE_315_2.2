import React from "react";

function Sidebar({ items, activePath, onNavigate }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoWrap}>
        <div style={styles.logoTitle}>Smart Campus</div>
        <div style={styles.logoSub}>Operations Hub</div>
      </div>

      <nav style={styles.nav}>
        {items.map((item) => {
          const isActive = activePath === item.path;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.path)}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    background: "var(--bg-sidebar)",
    borderRight: "1px solid var(--border-color)",
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logoWrap: {
    padding: "4px 10px 18px",
    borderBottom: "1px solid var(--border-color)",
    marginBottom: 12,
  },
  logoTitle: {
    color: "var(--accent-color)",
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "0.2px",
  },
  logoSub: {
    color: "var(--text-secondary)",
    marginTop: 2,
    fontSize: 12,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  navItem: {
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 10,
    color: "var(--text-secondary)",
    textAlign: "left",
    padding: "10px 12px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  navItemActive: {
    background: "var(--bg-input-focus)",
    border: "1px solid var(--border-color)",
    color: "var(--accent-color)",
  },
  icon: {
    width: 18,
    display: "inline-flex",
    justifyContent: "center",
  },
};

export default Sidebar;
