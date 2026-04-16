import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cancelBooking, getMyBookings } from "../services/bookingService";

const STATUS_CONFIG = {
    PENDING:   { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  icon: "⏳", label: "Pending"   },
    APPROVED:  { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   icon: "✅", label: "Approved"  },
    REJECTED:  { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   icon: "❌", label: "Rejected"  },
    CANCELLED: { color: "#64748b", bg: "rgba(100,116,139,0.15)", icon: "🚫", label: "Cancelled" },
};

export default function MyBookings() {
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [cancelLoading, setCancelLoading] = useState(false);
    const [message, setMessage] = useState("");

    const userId =
        localStorage.getItem("userId") ||
        localStorage.getItem("userName") ||
        "student001";

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await getMyBookings(userId);
            setBookings(Array.isArray(res?.data) ? res.data : []);
        } catch {
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        const flash = location?.state?.flash;
        if (flash) {
            setMessage(flash);
            window.history.replaceState({}, document.title);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        setCancelLoading(true);
        try {
            await cancelBooking(id);
            setMessage("Booking cancelled successfully.");
            setSelected(null);
            await fetchBookings();
        } catch {
            setMessage("Failed to cancel booking.");
        } finally {
            setCancelLoading(false);
        }
    };

    const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

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
                    <div>
                        <h1 style={styles.title}>My Bookings</h1>
                        <p style={styles.subtitle}>Track and manage all your booking requests</p>
                    </div>
                    <a href="/bookings/create" style={styles.newBtn}>+ New Booking</a>
                </div>

                {message && (
                    <div style={styles.messageBanner}>
                        {message}
                        <button onClick={() => setMessage("")} style={styles.closeBtn}>✕</button>
                    </div>
                )}

                {/* Stats Row */}
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
                            <span style={{ fontSize: 22 }}>{STATUS_CONFIG[key]?.icon || "📋"}</span>
                            <span style={{
                                color: filter === key ? (STATUS_CONFIG[key]?.color || "#3b82f6") : "#94a3b8",
                                fontWeight: 700, fontSize: 20
                            }}>{count}</span>
                            <span style={{ color: "#64748b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
                {key === "ALL" ? "Total" : key.charAt(0) + key.slice(1).toLowerCase()}
              </span>
                        </button>
                    ))}
                </div>

                <div style={styles.layout}>
                    {/* Bookings List */}
                    <div style={styles.list}>
                        {loading ? (
                            <div style={styles.empty}>⏳ Loading bookings...</div>
                        ) : filtered.length === 0 ? (
                            <div style={styles.empty}>
                                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                                <div style={{ color: "#64748b" }}>No bookings found</div>
                            </div>
                        ) : (
                            filtered.map((booking) => {
                                const s = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                                const isSelected = selected?.id === booking.id;
                                return (
                                    <div
                                        key={booking.id}
                                        onClick={() => setSelected(isSelected ? null : booking)}
                                        style={{
                                            ...styles.bookingCard,
                                            borderColor: isSelected ? s.color : "rgba(99,102,241,0.2)",
                                            background: isSelected ? "rgba(30,41,59,0.95)" : "rgba(30,41,59,0.8)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div style={styles.cardTop}>
                                            <div>
                                                <div style={styles.resourceName}>{booking.resourceName}</div>
                                                <div style={styles.resourceType}>{booking.resourceType}</div>
                                            </div>
                                            <span style={{ ...styles.statusBadge, color: s.color, background: s.bg }}>
                        {s.icon} {s.label}
                      </span>
                                        </div>
                                        <div style={styles.cardMeta}>
                                            <span>📅 {booking.bookingDate}</span>
                                            <span>🕐 {booking.startTime} – {booking.endTime}</span>
                                            <span>👥 {booking.expectedAttendees} attendees</span>
                                        </div>
                                        <div style={styles.purpose}>{booking.purpose}</div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Detail Panel */}
                    {selected && (
                        <div style={styles.detail}>
                            <div style={styles.detailHeader}>
                                <h3 style={styles.detailTitle}>Booking Details</h3>
                                <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
                            </div>

                            {/* Status */}
                            {(() => {
                                const s = STATUS_CONFIG[selected.status] || STATUS_CONFIG.PENDING;
                                return (
                                    <div style={{ ...styles.detailStatus, color: s.color, background: s.bg, borderColor: s.color }}>
                                        <span style={{ fontSize: 24 }}>{s.icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 16 }}>{s.label}</div>
                                            <div style={{ fontSize: 12, opacity: 0.8 }}>Current status</div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Details */}
                            <div style={styles.detailGrid}>
                                {[
                                    ["🏫 Resource", selected.resourceName],
                                    ["🏷️ Type", selected.resourceType],
                                    ["📅 Date", selected.bookingDate],
                                    ["🕐 Start", selected.startTime],
                                    ["🕔 End", selected.endTime],
                                    ["👥 Attendees", selected.expectedAttendees],
                                    ["🖥️ Projector", selected.needsProjector ? "Yes" : "No"],
                                    ["📋 Whiteboard", selected.needsWhiteboard ? "Yes" : "No"],
                                ].map(([label, value]) => (
                                    <div key={label} style={styles.detailRow}>
                                        <span style={styles.detailLabel}>{label}</span>
                                        <span style={styles.detailValue}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={styles.detailField}>
                                <span style={styles.detailLabel}>📝 Purpose</span>
                                <p style={styles.detailText}>{selected.purpose}</p>
                            </div>

                            {selected.rejectionReason && (
                                <div style={styles.rejectionBox}>
                                    <div style={styles.detailLabel}>❌ Rejection Reason</div>
                                    <p style={styles.detailText}>{selected.rejectionReason}</p>
                                </div>
                            )}

                            <div style={styles.detailFooter}>
                                <div style={{ color: "#64748b", fontSize: 12 }}>
                                    Booking ID: #{selected.id}
                                </div>
                                {selected.status === "APPROVED" && (
                                    <button
                                        onClick={() => handleCancel(selected.id)}
                                        style={styles.cancelBtn}
                                        disabled={cancelLoading}
                                    >
                                        {cancelLoading ? "Cancelling..." : "🚫 Cancel Booking"}
                                    </button>
                                )}
                            </div>
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
    container: { maxWidth: 1100, margin: "0 auto" },
    header: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 28,
    },
    title: { color: "#f1f5f9", fontSize: 28, fontWeight: 700, margin: 0 },
    subtitle: { color: "#64748b", margin: "4px 0 0", fontSize: 14 },
    newBtn: {
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white", textDecoration: "none",
        padding: "10px 20px", borderRadius: 10,
        fontSize: 14, fontWeight: 600,
    },
    messageBanner: {
        background: "rgba(34,197,94,0.15)", border: "1px solid #22c55e",
        borderRadius: 10, padding: "12px 16px", color: "#22c55e",
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: 20, fontSize: 14,
    },
    closeBtn: {
        marginLeft: "auto", background: "none",
        border: "none", color: "inherit", cursor: "pointer", fontSize: 16,
    },
    statsRow: {
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12, marginBottom: 24,
    },
    statCard: {
        background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 12, padding: "14px 10px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4, cursor: "pointer",
        transition: "all 0.2s",
    },
    layout: { display: "flex", gap: 20, alignItems: "flex-start" },
    list: { flex: 1, display: "flex", flexDirection: "column", gap: 12 },
    empty: {
        background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 16, padding: 48, textAlign: "center", color: "#94a3b8",
    },
    bookingCard: {
        background: "rgba(30,41,59,0.8)", border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 14, padding: 18, transition: "all 0.2s",
    },
    cardTop: {
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 10,
    },
    resourceName: { color: "#e2e8f0", fontWeight: 600, fontSize: 16 },
    resourceType: { color: "#64748b", fontSize: 12, marginTop: 2 },
    statusBadge: {
        padding: "4px 10px", borderRadius: 20,
        fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
    },
    cardMeta: {
        display: "flex", gap: 16, color: "#94a3b8",
        fontSize: 12, marginBottom: 8, flexWrap: "wrap",
    },
    purpose: { color: "#64748b", fontSize: 13, fontStyle: "italic" },
    detail: {
        width: 320, minWidth: 320,
        background: "rgba(30,41,59,0.95)", border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 16, padding: 20, position: "sticky", top: 20,
    },
    detailHeader: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16,
    },
    detailTitle: { color: "#e2e8f0", fontSize: 16, fontWeight: 600, margin: 0 },
    detailStatus: {
        display: "flex", alignItems: "center", gap: 12,
        border: "1px solid", borderRadius: 12, padding: 14, marginBottom: 16,
    },
    detailGrid: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
    detailRow: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", padding: "6px 0",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
    },
    detailLabel: { color: "#64748b", fontSize: 12 },
    detailValue: { color: "#e2e8f0", fontSize: 13, fontWeight: 500 },
    detailField: { marginBottom: 12 },
    detailText: { color: "#94a3b8", fontSize: 13, margin: "6px 0 0" },
    rejectionBox: {
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 10, padding: 12, marginBottom: 12,
    },
    detailFooter: {
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginTop: 16, paddingTop: 16,
        borderTop: "1px solid rgba(99,102,241,0.2)",
    },
    cancelBtn: {
        background: "rgba(239,68,68,0.2)", border: "1px solid #ef4444",
        color: "#ef4444", borderRadius: 8, padding: "8px 14px",
        fontSize: 13, cursor: "pointer", fontWeight: 600,
    },
};
