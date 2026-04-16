import { useState, useEffect } from "react";
import {
    approveBooking,
    deleteBooking,
    getAllBookings,
    rejectBooking,
} from "../services/bookingService";

const STATUS_CONFIG = {
    PENDING:   { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  icon: "⏳" },
    APPROVED:  { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   icon: "✅" },
    REJECTED:  { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   icon: "❌" },
    CANCELLED: { color: "#64748b", bg: "rgba(100,116,139,0.15)", icon: "🚫" },
};

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await getAllBookings();
            setBookings(Array.isArray(res?.data) ? res.data : []);
        } catch {
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleApprove = async (id) => {
        setActionLoading(true);
        try {
            await approveBooking(id);
            setMessage({ text: "✅ Booking approved successfully!", type: "success" });
            setSelected(null);
            await fetchAll();
        } catch {
            setMessage({ text: "Failed to approve booking.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason.trim()) {
            setMessage({ text: "Please provide a rejection reason.", type: "error" });
            return;
        }
        setActionLoading(true);
        try {
            await rejectBooking(id, rejectReason);
            setMessage({ text: "❌ Booking rejected.", type: "error" });
            setSelected(null);
            setShowRejectInput(false);
            setRejectReason("");
            await fetchAll();
        } catch {
            setMessage({ text: "Failed to reject booking.", type: "error" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently delete this booking record?")) return;
        try {
            await deleteBooking(id);
            setMessage({ text: "🗑️ Booking deleted.", type: "success" });
            setSelected(null);
            await fetchAll();
        } catch {
            setMessage({ text: "Failed to delete.", type: "error" });
        }
    };

    const filtered = bookings
        .filter((b) => filter === "ALL" || b.status === filter)
        .filter((b) =>
            search === "" ||
            b.resourceName?.toLowerCase().includes(search.toLowerCase()) ||
            b.userName?.toLowerCase().includes(search.toLowerCase()) ||
            b.userId?.toLowerCase().includes(search.toLowerCase())
        );

    const counts = {
        ALL: bookings.length,
        PENDING: bookings.filter((b) => b.status === "PENDING").length,
        APPROVED: bookings.filter((b) => b.status === "APPROVED").length,
        REJECTED: bookings.filter((b) => b.status === "REJECTED").length,
        CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <div style={styles.adminBadge}>🔐 ADMIN</div>
                        <div>
                            <h1 style={styles.title}>Booking Management</h1>
                            <p style={styles.subtitle}>Review and manage all booking requests</p>
                        </div>
                    </div>
                    <button onClick={fetchAll} style={styles.refreshBtn}>🔄 Refresh</button>
                </div>

                {/* Message */}
                {message.text && (
                    <div style={{
                        ...styles.messageBanner,
                        background: message.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        borderColor: message.type === "success" ? "#22c55e" : "#ef4444",
                        color: message.type === "success" ? "#22c55e" : "#ef4444",
                    }}>
                        {message.text}
                        <button onClick={() => setMessage({ text: "", type: "" })} style={styles.closeBtn}>✕</button>
                    </div>
                )}

                {/* Stats */}
                <div style={styles.statsRow}>
                    {Object.entries(counts).map(([key, count]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            style={{
                                ...styles.statCard,
                                borderColor: filter === key
                                    ? (STATUS_CONFIG[key]?.color || "#3b82f6")
                                    : "rgba(99,102,241,0.2)",
                                background: filter === key
                                    ? (STATUS_CONFIG[key]?.bg || "rgba(59,130,246,0.15)")
                                    : "rgba(30,41,59,0.8)",
                            }}
                        >
                            <span style={{ fontSize: 20 }}>{STATUS_CONFIG[key]?.icon || "📋"}</span>
                            <span style={{
                                color: filter === key ? (STATUS_CONFIG[key]?.color || "#3b82f6") : "#e2e8f0",
                                fontWeight: 700, fontSize: 22,
                            }}>{count}</span>
                            <span style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
                {key === "ALL" ? "Total" : key.charAt(0) + key.slice(1).toLowerCase()}
              </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={styles.searchBar}>
                    <span style={{ color: "#64748b", fontSize: 18 }}>🔍</span>
                    <input
                        style={styles.searchInput}
                        placeholder="Search by resource, student name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div style={styles.layout}>
                    {/* Table */}
                    <div style={styles.tableWrap}>
                        {loading ? (
                            <div style={styles.empty}>⏳ Loading bookings...</div>
                        ) : filtered.length === 0 ? (
                            <div style={styles.empty}>
                                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                                <div>No bookings found</div>
                            </div>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    {["ID", "Resource", "Student", "Date", "Time", "Attendees", "Status", "Action"].map((h) => (
                                        <th key={h} style={styles.th}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map((booking) => {
                                    const s = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                                    const isSelected = selected?.id === booking.id;
                                    return (
                                        <tr
                                            key={booking.id}
                                            onClick={() => { setSelected(isSelected ? null : booking); setShowRejectInput(false); setRejectReason(""); }}
                                            style={{
                                                ...styles.tr,
                                                background: isSelected ? "rgba(59,130,246,0.1)" : "transparent",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <td style={styles.td}>#{booking.id}</td>
                                            <td style={styles.td}>
                                                <div style={{ color: "#e2e8f0", fontWeight: 500 }}>{booking.resourceName}</div>
                                                <div style={{ color: "#64748b", fontSize: 11 }}>{booking.resourceType}</div>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={{ color: "#e2e8f0" }}>{booking.userName}</div>
                                                <div style={{ color: "#64748b", fontSize: 11 }}>{booking.userId}</div>
                                            </td>
                                            <td style={styles.td}>{booking.bookingDate}</td>
                                            <td style={styles.td}>{booking.startTime}–{booking.endTime}</td>
                                            <td style={styles.td}>{booking.expectedAttendees}</td>
                                            <td style={styles.td}>
                          <span style={{ ...styles.badge, color: s.color, background: s.bg }}>
                            {s.icon} {booking.status}
                          </span>
                                            </td>
                                            <td style={styles.td}>
                                                {booking.status === "PENDING" && (
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleApprove(booking.id); }}
                                                            style={styles.approveBtn}
                                                            disabled={actionLoading}
                                                        >✅</button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSelected(booking); setShowRejectInput(true); }}
                                                            style={styles.rejectBtn}
                                                        >❌</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Detail Panel */}
                    {selected && (
                        <div style={styles.detail}>
                            <div style={styles.detailHeader}>
                                <h3 style={styles.detailTitle}>Booking #{selected.id}</h3>
                                <button onClick={() => { setSelected(null); setShowRejectInput(false); setRejectReason(""); }} style={styles.closeBtn}>✕</button>
                            </div>

                            {(() => {
                                const s = STATUS_CONFIG[selected.status] || STATUS_CONFIG.PENDING;
                                return (
                                    <div style={{ ...styles.statusBox, color: s.color, background: s.bg, borderColor: s.color }}>
                                        {s.icon} {selected.status}
                                    </div>
                                );
                            })()}

                            {[
                                ["🏫 Resource", selected.resourceName],
                                ["🏷️ Type", selected.resourceType],
                                ["👤 Student", selected.userName],
                                ["🆔 User ID", selected.userId],
                                ["📅 Date", selected.bookingDate],
                                ["🕐 Time", `${selected.startTime} – ${selected.endTime}`],
                                ["👥 Attendees", selected.expectedAttendees],
                                ["🖥️ Projector", selected.needsProjector ? "Yes" : "No"],
                                ["📋 Whiteboard", selected.needsWhiteboard ? "Yes" : "No"],
                            ].map(([label, value]) => (
                                <div key={label} style={styles.detailRow}>
                                    <span style={styles.detailLabel}>{label}</span>
                                    <span style={styles.detailValue}>{value}</span>
                                </div>
                            ))}

                            <div style={{ marginTop: 12 }}>
                                <div style={styles.detailLabel}>📝 Purpose</div>
                                <p style={styles.detailText}>{selected.purpose}</p>
                            </div>

                            {selected.rejectionReason && (
                                <div style={styles.rejectionBox}>
                                    <div style={styles.detailLabel}>❌ Rejection Reason</div>
                                    <p style={styles.detailText}>{selected.rejectionReason}</p>
                                </div>
                            )}

                            {/* Actions */}
                            {selected.status === "PENDING" && (
                                <div style={styles.actions}>
                                    <button
                                        onClick={() => handleApprove(selected.id)}
                                        style={styles.approveFullBtn}
                                        disabled={actionLoading}
                                    >
                                        ✅ Approve Booking
                                    </button>
                                    <button
                                        onClick={() => setShowRejectInput(!showRejectInput)}
                                        style={styles.rejectFullBtn}
                                    >
                                        ❌ Reject Booking
                                    </button>
                                    {showRejectInput && (
                                        <div style={styles.rejectForm}>
                      <textarea
                          style={styles.rejectInput}
                          placeholder="Enter rejection reason..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows={3}
                      />
                                            <button
                                                onClick={() => handleReject(selected.id)}
                                                style={styles.rejectSubmitBtn}
                                                disabled={actionLoading}
                                            >
                                                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={() => handleDelete(selected.id)}
                                style={styles.deleteBtn}
                            >
                                🗑️ Delete Record
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: "32px 16px",
        fontFamily: "'Segoe UI', sans-serif",
    },
    container: { maxWidth: 1300, margin: "0 auto" },
    header: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 28,
    },
    headerLeft: { display: "flex", alignItems: "center", gap: 16 },
    adminBadge: {
        background: "linear-gradient(135deg, #dc2626, #991b1b)",
        color: "white", padding: "6px 12px", borderRadius: 8,
        fontSize: 11, fontWeight: 700, letterSpacing: 1,
    },
    title: { color: "#f1f5f9", fontSize: 26, fontWeight: 700, margin: 0 },
    subtitle: { color: "#64748b", margin: "4px 0 0", fontSize: 14 },
    refreshBtn: {
        background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
        color: "#a5b4fc", padding: "10px 18px", borderRadius: 10,
        fontSize: 14, cursor: "pointer", fontWeight: 600,
    },
    messageBanner: {
        border: "1px solid", borderRadius: 10, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 20, fontSize: 14,
    },
    closeBtn: {
        marginLeft: "auto", background: "none",
        border: "none", color: "inherit", cursor: "pointer", fontSize: 16,
    },
    statsRow: {
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12, marginBottom: 20,
    },
    statCard: {
        border: "1px solid", borderRadius: 12, padding: "14px 10px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4, cursor: "pointer", transition: "all 0.2s",
    },
    searchBar: {
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 12, padding: "10px 16px", marginBottom: 20,
    },
    searchInput: {
        background: "none", border: "none", color: "#e2e8f0",
        fontSize: 14, flex: 1, outline: "none",
    },
    layout: { display: "flex", gap: 20, alignItems: "flex-start" },
    tableWrap: {
        flex: 1, background: "rgba(30,41,59,0.8)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 16, overflow: "hidden",
    },
    empty: {
        padding: 48, textAlign: "center", color: "#94a3b8",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        padding: "12px 16px", textAlign: "left",
        color: "#64748b", fontSize: 12, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: 0.5,
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        background: "rgba(15,23,42,0.5)",
    },
    tr: {
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        transition: "background 0.15s",
    },
    td: { padding: "12px 16px", color: "#94a3b8", fontSize: 13 },
    badge: {
        padding: "3px 8px", borderRadius: 20,
        fontSize: 11, fontWeight: 600,
    },
    approveBtn: {
        background: "rgba(34,197,94,0.2)", border: "1px solid #22c55e",
        borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 14,
    },
    rejectBtn: {
        background: "rgba(239,68,68,0.2)", border: "1px solid #ef4444",
        borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 14,
    },
    detail: {
        width: 300, minWidth: 300,
        background: "rgba(30,41,59,0.95)", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 16, padding: 20, position: "sticky", top: 20,
    },
    detailHeader: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 14,
    },
    detailTitle: { color: "#e2e8f0", fontSize: 15, fontWeight: 600, margin: 0 },
    statusBox: {
        border: "1px solid", borderRadius: 10, padding: "10px 14px",
        fontWeight: 700, marginBottom: 14, fontSize: 14,
    },
    detailRow: {
        display: "flex", justifyContent: "space-between",
        padding: "6px 0", borderBottom: "1px solid rgba(99,102,241,0.1)",
    },
    detailLabel: { color: "#64748b", fontSize: 12 },
    detailValue: { color: "#e2e8f0", fontSize: 13, fontWeight: 500 },
    detailText: { color: "#94a3b8", fontSize: 13, margin: "6px 0 0" },
    rejectionBox: {
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 10, padding: 12, marginTop: 12,
    },
    actions: { display: "flex", flexDirection: "column", gap: 8, marginTop: 16 },
    approveFullBtn: {
        background: "rgba(34,197,94,0.2)", border: "1px solid #22c55e",
        color: "#22c55e", borderRadius: 8, padding: "10px",
        fontSize: 14, cursor: "pointer", fontWeight: 600,
    },
    rejectFullBtn: {
        background: "rgba(239,68,68,0.2)", border: "1px solid #ef4444",
        color: "#ef4444", borderRadius: 8, padding: "10px",
        fontSize: 14, cursor: "pointer", fontWeight: 600,
    },
    rejectForm: { display: "flex", flexDirection: "column", gap: 8 },
    rejectInput: {
        background: "rgba(15,23,42,0.8)", border: "1px solid rgba(239,68,68,0.4)",
        borderRadius: 8, padding: 10, color: "#e2e8f0",
        fontSize: 13, resize: "vertical", outline: "none",
    },
    rejectSubmitBtn: {
        background: "#dc2626", border: "none",
        color: "white", borderRadius: 8, padding: "10px",
        fontSize: 13, cursor: "pointer", fontWeight: 600,
    },
    deleteBtn: {
        background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.3)",
        color: "#64748b", borderRadius: 8, padding: "8px",
        fontSize: 13, cursor: "pointer", width: "100%", marginTop: 12,
    },
};
