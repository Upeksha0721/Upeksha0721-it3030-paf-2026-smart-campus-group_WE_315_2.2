import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService";

const FACILITY_API = "http://localhost:8083/api/facilities";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function CreateBooking() {
    const navigate = useNavigate();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentUserId =
        localStorage.getItem("userId") ||
        localStorage.getItem("userName") ||
        "student001";
    const currentUserName = localStorage.getItem("userName") || "Student";

    const [form, setForm] = useState({
        resourceName: "",
        resourceType: "",
        userId: currentUserId,
        userName: currentUserName,
        bookingDate: "",
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: 1,
        needsProjector: false,
        needsWhiteboard: false,
    });

    const [facilitySearch, setFacilitySearch] = useState("");

    const loadFacilities = async () => {
        try {
            setError("");
            const r = await fetch(FACILITY_API, { headers: getHeaders() });
            if (!r.ok) return setFacilities([]);
            const data = await r.json();
            setFacilities(Array.isArray(data) ? data : []);
        } catch {
            setFacilities([]);
        }
    };

    useEffect(() => {
        loadFacilities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredFacilities = useMemo(() => {
        const q = facilitySearch.trim().toLowerCase();
        if (!q) return facilities;
        return facilities.filter((f) => {
            return (
                f?.name?.toLowerCase().includes(q) ||
                f?.type?.toLowerCase().includes(q) ||
                f?.location?.toLowerCase().includes(q)
            );
        });
    }, [facilitySearch, facilities]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleFacilitySelect = (e) => {
        if (e.target.value === "manual") {
            setForm((prev) => ({ ...prev, resourceName: "", resourceType: "" }));
            return;
        }

        const selected = facilities.find((f) => f.name === e.target.value);
        if (selected) {
            setForm((prev) => ({
                ...prev,
                resourceName: selected.name,
                resourceType: selected.type,
            }));
        } else {
            setForm((prev) => ({ ...prev, resourceName: e.target.value, resourceType: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            if (!localStorage.getItem("token")) {
                throw new Error("You are not logged in. Please login again and try.");
            }
            if (form.startTime >= form.endTime) {
                throw new Error("End time must be later than start time.");
            }

            await createBooking({
                ...form,
                userId: currentUserId,
                userName: currentUserName,
                expectedAttendees: Number(form.expectedAttendees || 0),
            });

            navigate("/bookings", {
                replace: true,
                state: {
                    flash: "✅ Booking request submitted successfully! You can track it here.",
                },
            });
        } catch (err) {
            const raw =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create booking";
            const friendly =
                raw === "Network Error"
                    ? "Cannot reach booking-service. Please ensure booking-service (8084) is running and you are logged in."
                    : raw;
            setError(String(friendly).replaceAll('"', ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerIcon}>📅</div>
                    <div>
                        <h1 style={styles.title}>Request a Booking</h1>
                        <p style={styles.subtitle}>Reserve a facility or resource for your session</p>
                    </div>
                </div>

                {error && (
                    <div style={styles.errorBanner}>
                        <span>⚠️</span>
                        <span>{error}</span>
                        <button onClick={() => setError("")} style={styles.closeBtn}>✕</button>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Resource Selection */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <span style={styles.sectionNum}>01</span> Resource Details
                        </h2>
                        <div style={styles.grid2}>
                            <div style={styles.field}>
                                <label style={styles.label}>Select Facility</label>
                                <input
                                    style={{ ...styles.input, marginBottom: 10 }}
                                    value={facilitySearch}
                                    onChange={(e) => setFacilitySearch(e.target.value)}
                                    placeholder="Search facility by name/type/location..."
                                />
                                <select
                                    style={styles.input}
                                    onChange={handleFacilitySelect}
                                    value={form.resourceName}
                                >
                                    <option value="">-- Choose a facility --</option>
                                    {filteredFacilities.map((f) => (
                                        <option key={f.id} value={f.name}>
                                            {f.name} ({f.type}) — {f.location || "Location N/A"} — Capacity: {f.capacity}
                                        </option>
                                    ))}
                                    <option value="manual">Enter manually</option>
                                </select>
                                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                                    <button
                                        type="button"
                                        onClick={loadFacilities}
                                        style={{
                                            ...styles.submitBtn,
                                            padding: "10px 14px",
                                            width: "auto",
                                            background: "rgba(59,130,246,0.15)",
                                            border: "1px solid rgba(59,130,246,0.35)",
                                        }}
                                    >
                                        🔄 Reload Facilities
                                    </button>
                                    <div style={{ color: "#64748b", fontSize: 12, alignSelf: "center" }}>
                                        Showing {filteredFacilities.length} / {facilities.length}
                                    </div>
                                </div>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Resource Name *</label>
                                <input
                                    style={styles.input}
                                    name="resourceName"
                                    value={form.resourceName}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Lab A"
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Resource Type</label>
                                <select style={styles.input} name="resourceType" value={form.resourceType} onChange={handleChange}>
                                    <option value="">-- Select type --</option>
                                    <option value="LAB">Lab</option>
                                    <option value="CLASSROOM">Classroom</option>
                                    <option value="MEETING_ROOM">Meeting Room</option>
                                    <option value="LECTURE_HALL">Lecture Hall</option>
                                    <option value="EQUIPMENT">Equipment</option>
                                </select>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Expected Attendees *</label>
                                <input
                                    style={styles.input}
                                    type="number"
                                    name="expectedAttendees"
                                    value={form.expectedAttendees}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <span style={styles.sectionNum}>02</span> Date & Time
                        </h2>
                        <div style={styles.grid3}>
                            <div style={styles.field}>
                                <label style={styles.label}>Booking Date *</label>
                                <input
                                    style={styles.input}
                                    type="date"
                                    name="bookingDate"
                                    value={form.bookingDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Start Time *</label>
                                <input
                                    style={styles.input}
                                    type="time"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>End Time *</label>
                                <input
                                    style={styles.input}
                                    type="time"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Purpose */}
                    <div style={styles.section}>
                        <h2 style={styles.sectionTitle}>
                            <span style={styles.sectionNum}>03</span> Purpose & Requirements
                        </h2>
                        <div style={styles.field}>
                            <label style={styles.label}>Purpose of Booking *</label>
                            <textarea
                                style={{ ...styles.input, height: 90, resize: "vertical" }}
                                name="purpose"
                                value={form.purpose}
                                onChange={handleChange}
                                placeholder="Describe the purpose of this booking..."
                                required
                            />
                        </div>
                        <div style={styles.checkboxRow}>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="needsProjector"
                                    checked={form.needsProjector}
                                    onChange={handleChange}
                                    style={styles.checkbox}
                                />
                                <span>🖥️ Needs Projector</span>
                            </label>
                            <label style={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    name="needsWhiteboard"
                                    checked={form.needsWhiteboard}
                                    onChange={handleChange}
                                    style={styles.checkbox}
                                />
                                <span>📋 Needs Whiteboard</span>
                            </label>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <button type="submit" style={styles.submitBtn} disabled={loading}>
                            {loading ? "⏳ Submitting..." : "📨 Submit Booking Request"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/bookings")}
                            style={{
                                ...styles.submitBtn,
                                background: "rgba(99,102,241,0.12)",
                                border: "1px solid rgba(99,102,241,0.35)",
                            }}
                            disabled={loading}
                        >
                            📋 View My Bookings
                        </button>
                    </div>
                </form>
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
    container: {
        maxWidth: 800,
        margin: "0 auto",
    },
    header: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: 32,
    },
    headerIcon: {
        fontSize: 48,
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        borderRadius: 16,
        width: 72,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#f1f5f9",
        fontSize: 28,
        fontWeight: 700,
        margin: 0,
    },
    subtitle: {
        color: "#64748b",
        margin: "4px 0 0",
        fontSize: 14,
    },
    successBanner: {
        background: "rgba(34,197,94,0.15)",
        border: "1px solid #22c55e",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#22c55e",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 24,
        fontSize: 14,
    },
    errorBanner: {
        background: "rgba(239,68,68,0.15)",
        border: "1px solid #ef4444",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#ef4444",
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 24,
        fontSize: 14,
    },
    closeBtn: {
        marginLeft: "auto",
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        fontSize: 16,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 24,
    },
    section: {
        background: "rgba(30,41,59,0.8)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: 16,
        padding: 24,
    },
    sectionTitle: {
        color: "#e2e8f0",
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 20,
        marginTop: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    sectionNum: {
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white",
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 12,
        fontWeight: 700,
    },
    grid2: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
    },
    grid3: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    label: {
        color: "#94a3b8",
        fontSize: 13,
        fontWeight: 500,
    },
    input: {
        background: "rgba(15,23,42,0.8)",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 8,
        padding: "10px 12px",
        color: "#e2e8f0",
        fontSize: 14,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
    },
    checkboxRow: {
        display: "flex",
        gap: 24,
        marginTop: 12,
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#94a3b8",
        fontSize: 14,
        cursor: "pointer",
    },
    checkbox: {
        width: 16,
        height: 16,
        cursor: "pointer",
    },
    submitBtn: {
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        color: "white",
        border: "none",
        borderRadius: 12,
        padding: "14px 32px",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "opacity 0.2s",
        width: "auto",
        minWidth: 260,
    },
};
