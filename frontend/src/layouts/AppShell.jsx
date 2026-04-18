import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function AppShell({ title, role, userName, items, activePath, onNavigate, onLogout, children }) {
  return (
    <div style={styles.page}>
      <Sidebar items={items} activePath={activePath} onNavigate={onNavigate} />
      <div style={styles.main}>
        <Topbar title={title} role={role} userName={userName} onLogout={onLogout} />
        <main style={styles.content}>{children}</main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    background: "var(--bg-app)",
    fontFamily: "Segoe UI, sans-serif",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    background: "var(--bg-app)",
  },
};

export default AppShell;
