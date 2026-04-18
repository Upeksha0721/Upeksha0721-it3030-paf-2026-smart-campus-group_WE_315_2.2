import React from "react";

function ModulePlaceholder({ title, description }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.icon}>🚧</div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.description}>{description}</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: 24,
  },
  card: {
    background: 'var(--bg-card)',
    border: "1px solid var(--border-color)",
    borderRadius: 14,
    padding: "48px 24px",
    textAlign: "center",
  },
  icon: {
    fontSize: 44,
    marginBottom: 14,
  },
  title: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: 24,
    fontWeight: 700,
  },
  description: {
    margin: "10px auto 0",
    maxWidth: 620,
    color: "#9DB1C7",
    fontSize: 14,
    lineHeight: 1.7,
  },
};

export default ModulePlaceholder;
