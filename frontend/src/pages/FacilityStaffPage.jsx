import React, { useEffect, useState } from "react";
import FacilityTable from "../components/FacilityTable";
import { getAllFacilities, searchFacilities } from "../services/facilityService";

function FacilityStaffPage() {
  const [facilities, setFacilities] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    minCapacity: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // "info" | "success" | "error"
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [reportText, setReportText] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const data = await getAllFacilities();
      setFacilities(data);
    } catch (error) {
      console.error(error);
      showMessage("Failed to load facilities", "error");
    }
  };

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSearch = async () => {
    try {
      const data = await searchFacilities(filters);
      setFacilities(data);
      showMessage(`${data.length} result(s) found`, "info");
    } catch (error) {
      console.error(error);
      showMessage("Search failed", "error");
    }
  };

  const handleReset = () => {
    setFilters({ type: "", minCapacity: "", location: "" });
    fetchFacilities();
    showMessage("Filters cleared", "info");
  };

  const handleReportIssue = (facility) => {
    setSelectedFacility(facility);
    setReportText("");
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    if (!reportText.trim()) {
      showMessage("Please describe the issue before submitting", "error");
      return;
    }
    // TODO: connect to incident-service API
    console.log("Issue reported for:", selectedFacility?.name, "->", reportText);
    showMessage(`Issue reported for ${selectedFacility?.name}`, "success");
    setShowReportModal(false);
    setReportText("");
    setSelectedFacility(null);
  };

  const messageStyle = {
    ...styles.message,
    ...(messageType === "success" ? styles.messageSuccess : {}),
    ...(messageType === "error" ? styles.messageError : {}),
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.headerCard}>
        <div>
          <h2 style={styles.pageTitle}>Facilities Overview</h2>
          <p style={styles.pageSubtitle}>
            Browse campus facilities, check availability, and report maintenance issues.
          </p>
        </div>
        <div style={styles.badge}>Staff View</div>
      </div>

      {/* Message Banner */}
      {message && <div style={messageStyle}>{message}</div>}

      {/* Stats Row */}
      <div style={styles.statsRow}>
        {[
          ["Total Facilities", facilities.length],
          ["Lecture Halls", facilities.filter((f) => f.type === "LECTURE_HALL").length],
          ["Labs", facilities.filter((f) => f.type === "LAB").length],
          ["Meeting Rooms", facilities.filter((f) => f.type === "MEETING_ROOM").length],
        ].map(([label, value]) => (
          <div key={label} style={styles.statCard}>
            <div style={styles.statLabel}>{label}</div>
            <div style={styles.statValue}>{value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Search & Filter Facilities</h3>
        </div>
        <div style={styles.filterRow}>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            style={styles.input}
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          <input
            type="number"
            placeholder="Minimum Capacity"
            value={filters.minCapacity}
            onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            style={styles.input}
          />

          <button onClick={handleSearch} style={styles.searchBtn}>
            Search
          </button>
          <button onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>
      </div>

      {/* Facilities List */}
      <div style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Available Facilities</h3>
          <span style={styles.countBadge}>{facilities.length} total</span>
        </div>

        {/* Custom staff table with Report Issue button */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Name", "Type", "Capacity", "Location", "Status", "Action"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...styles.td, textAlign: "center", color: 'var(--text-secondary)', padding: "32px" }}>
                    No facilities found.
                  </td>
                </tr>
              ) : (
                facilities.map((facility) => (
                  <tr key={facility.id} style={styles.row}>
                    <td style={{ ...styles.td, fontWeight: 600, color: 'var(--text-primary)' }}>{facility.name}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.typeBadge, ...getTypeBadgeStyle(facility.type) }}>
                        {formatType(facility.type)}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: 'var(--text-secondary)' }}>{facility.capacity ?? "—"}</td>
                    <td style={{ ...styles.td, color: 'var(--text-secondary)' }}>{facility.location ?? "—"}</td>
                    <td style={styles.td}>
                      <span style={facility.available ? styles.statusAvailable : styles.statusUnavailable}>
                        {facility.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleReportIssue(facility)}
                        style={styles.reportBtn}
                      >
                        Report Issue
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Report an Issue</h3>
              <button onClick={() => setShowReportModal(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.modalBody}>
              <p style={styles.modalFacilityName}>
                Facility: <span style={{ color: 'var(--accent-color)' }}>{selectedFacility?.name}</span>
              </p>
              <p style={styles.modalFacilityName}>
                Location: <span style={{ color: 'var(--text-secondary)' }}>{selectedFacility?.location ?? "N/A"}</span>
              </p>

              <label style={styles.label}>Issue Description</label>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Describe the issue in detail (e.g. broken projector, AC not working...)"
                style={styles.textarea}
                rows={4}
              />

              <label style={styles.label}>Priority</label>
              <select style={styles.input}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowReportModal(false)} style={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSubmitReport} style={styles.submitBtn}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function formatType(type) {
  if (!type) return "—";
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTypeBadgeStyle(type) {
  const map = {
    LECTURE_HALL: { background: "#0A2A4A", color: "#60a5fa" },
    LAB:          { background: "#0F2A10", color: 'var(--success-color)' },
    MEETING_ROOM: { background: "#3D2A00", color: 'var(--accent-color)' },
    EQUIPMENT:    { background: "#2A0A1A", color: "#f472b6" },
  };
  return map[type] || { background: "#1A2A3A", color: 'var(--text-secondary)' };
}

const styles = {
  wrapper: {
    padding: "20px",
    background: 'var(--bg-app)',
    color: 'var(--text-primary)',
    minHeight: "100%",
  },
  headerCard: {
    background: 'var(--bg-card)',
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  pageSubtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: 'var(--text-secondary)',
    fontSize: "14px",
  },
  badge: {
    background: "#0A2A4A",
    color: "#60a5fa",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  message: {
    background: 'var(--border-color)',
    color: 'var(--text-primary)',
    padding: "12px 14px",
    borderRadius: "10px",
    marginBottom: "18px",
    border: "1px solid #23496f",
  },
  messageSuccess: {
    background: "#0F2A10",
    border: "1px solid #166534",
    color: 'var(--success-color)',
  },
  messageError: {
    background: 'var(--danger-border)',
    border: "1px solid #7f1d1d",
    color: 'var(--danger-color)',
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },
  statCard: {
    background: 'var(--bg-card)',
    border: "1px solid var(--border-color)",
    borderTop: "3px solid #60a5fa",
    borderRadius: "10px",
    padding: "14px",
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontSize: "11px",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  statValue: {
    color: 'var(--text-primary)',
    fontSize: "22px",
    fontWeight: 700,
  },
  sectionCard: {
    background: 'var(--bg-card)',
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "12px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: "20px",
    fontWeight: 700,
  },
  countBadge: {
    background: 'var(--bg-input)',
    color: 'var(--text-secondary)',
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    border: "1px solid var(--border-color)",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginTop: "6px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  searchBtn: {
    background: "#60a5fa",
    color: 'var(--bg-app)',
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resetBtn: {
    background: "#5B6470",
    color: 'var(--text-primary)',
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
  th: {
    background: 'var(--bg-input)',
    color: 'var(--text-secondary)',
    padding: "10px 12px",
    textAlign: "left",
    borderBottom: "1px solid var(--border-color)",
    fontWeight: 600,
    fontSize: "12px",
    textTransform: "uppercase",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid var(--border-color)",
    color: 'var(--text-secondary)',
    verticalAlign: "middle",
  },
  row: {
    transition: "background 0.15s",
  },
  typeBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
  },
  statusAvailable: {
    background: "#0F2A10",
    color: 'var(--success-color)',
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
  },
  statusUnavailable: {
    background: 'var(--danger-border)',
    color: 'var(--danger-color)',
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 600,
  },
  reportBtn: {
    background: "transparent",
    color: 'var(--accent-color)',
    border: "1px solid var(--accent-color)",
    borderRadius: "6px",
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  // Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: 'var(--bg-card)',
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "480px",
    margin: "0 16px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border-color)",
  },
  modalTitle: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: "18px",
    fontWeight: 700,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: 'var(--text-secondary)',
    fontSize: "16px",
    cursor: "pointer",
  },
  modalBody: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  modalFacilityName: {
    margin: 0,
    color: 'var(--text-secondary)',
    fontSize: "13px",
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    padding: "16px 20px",
    borderTop: "1px solid var(--border-color)",
  },
  cancelBtn: {
    background: "transparent",
    color: 'var(--text-secondary)',
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "9px 18px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
  },
  submitBtn: {
    background: 'var(--accent-color)',
    color: 'var(--bg-app)',
    border: "none",
    borderRadius: "8px",
    padding: "9px 18px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "13px",
  },
};

export default FacilityStaffPage;