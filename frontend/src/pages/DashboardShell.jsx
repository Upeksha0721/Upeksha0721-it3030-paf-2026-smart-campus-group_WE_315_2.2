import React from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AppShell from "../layouts/AppShell";
import { getRoleNavigation } from "../config/navigation";
import FacilityAdminPage from "./FacilityAdminPage";
import FacilityStaffPage from "./FacilityStaffPage";
import FacilityStudentPage from "./FacilityStudentPage";
import UserManagementPage from "./UserManagementPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";
import BookingAdminPage from "./BookingAdminPage";
import BookingStaffPage from "./BookingStaffPage";
import BookingStudentPage from "./BookingStudentPage";
import AccountPage from "./AccountPage";
import NotificationsPage from "./NotificationsPage";
import IncidentList from "./IncidentList";
import ModulePlaceholder from "./ModulePlaceholder";

function OverviewPage({ role }) {
  const isStudent = role !== "ADMIN" && role !== "STAFF" && role !== "TECHNICIAN";
  const roleTitle = role === "ADMIN" ? "Admin" : role === "STAFF" || role === "TECHNICIAN" ? "Staff" : "Student";
  const cards = role === "ADMIN"
    ? [
        ["Pending Bookings", "12"],
        ["Open Incidents", "7"],
        ["Total Facilities", "18"],
        ["Active Users", "124"],
      ]
    : role === "STAFF" || role === "TECHNICIAN"
      ? [
          ["Assigned Tasks", "8"],
          ["In Progress", "4"],
          ["Completed Today", "2"],
          ["Escalations", "1"],
        ]
      : [
          ["My Bookings", "3"],
          ["Pending Requests", "1"],
          ["Unread Alerts", "2"],
          ["Available Facilities", "5"],
        ];

    const studentInfo = [
      ["Today On Campus", "AI Lab workshop at 2:00 PM, Main Auditorium"],
      ["Library Hours", "Open until 10:00 PM with quiet study zones"],
      ["Career Center", "CV clinic slots available this week"],
      ["Support Desk", "IT help desk active in Block B until 6:00 PM"],
    ];

  return (
    <div style={overviewStyles.wrap}>
        <div style={{ ...overviewStyles.hero, ...(isStudent ? overviewStyles.studentHero : {}) }}>
        <h2 style={overviewStyles.heroTitle}>{roleTitle} Overview</h2>
          <p style={overviewStyles.heroSub}>
            {isStudent
              ? "Your campus day at a glance: bookings, updates, events, and student services in one place."
              : "A single, professional workspace with role-based modules and consistent navigation."}
          </p>
      </div>
      <div style={overviewStyles.grid}>
        {cards.map(([label, value]) => (
          <div key={label} style={overviewStyles.card}>
            <div style={overviewStyles.cardLabel}>{label}</div>
            <div style={overviewStyles.cardValue}>{value}</div>
          </div>
        ))}
      </div>

        {isStudent && (
          <div style={overviewStyles.studentInfoWrap}>
            {studentInfo.map(([title, detail]) => (
              <div key={title} style={overviewStyles.studentInfoCard}>
                <div style={overviewStyles.studentInfoTitle}>{title}</div>
                <div style={overviewStyles.studentInfoDetail}>{detail}</div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

function DashboardShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role") || "USER";
  const userName = localStorage.getItem("userName") || "Campus User";
  const navItems = getRoleNavigation(role);

  const activeSegment = location.pathname.split("/")[2] || "overview";
  const activeNav = navItems.find((item) => item.path === activeSegment) || navItems[0];

  const handleNavigate = (path) => navigate(`/dashboard/${path}`);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AppShell
      title={activeNav.label}
      role={role}
      userName={userName}
      items={navItems}
      activePath={activeNav.path}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage role={role} />} />

        <Route path="bookings" element={
          role === "ADMIN" ? <BookingAdminPage /> : role === "STAFF" || role === "TECHNICIAN" ? <BookingStaffPage /> : <BookingStudentPage />
        } />
        <Route
          path="incidents"
          element={<IncidentList />}
        />
        <Route
          path="notifications"
          element={<NotificationsPage />}
        />
        <Route
          path="tickets"
          element={<IncidentList />}
        />
        <Route
          path="completed"
          element={<IncidentList mode="completed" />}
        />
        <Route
          path="schedule"
          element={<ModulePlaceholder title="Schedule" description="Task calendar and assignment schedule can be integrated here." />}
        />
        <Route
          path="account"
          element={<AccountPage />}
        />

        <Route path="facilities" element={
          role === "ADMIN" ? <FacilityAdminPage /> : role === "STAFF" || role === "TECHNICIAN" ? <FacilityStaffPage /> : <FacilityStudentPage />
        } />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />

        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </AppShell>
  );
}

const overviewStyles = {
  wrap: {
    padding: 24,
  },
  hero: {
    background: "linear-gradient(rgba(10, 22, 40, 0.6), rgba(10, 22, 40, 0.85)), url('/assets/sliit_bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    border: "1px solid var(--border-color)",
    borderRadius: 14,
    padding: "48px 32px",
    marginBottom: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },
  studentHero: {
    background: "linear-gradient(rgba(8, 24, 41, 0.35), rgba(8, 24, 41, 0.82)), url('/assets/sliit_bg.png')",
    borderLeft: "4px solid var(--accent-color)",
  },
  heroTitle: {
    margin: 0,
    color: 'var(--text-primary)',
    fontSize: 24,
    fontWeight: 700,
  },
  heroSub: {
    margin: "8px 0 0",
    color: "#A0B4C8",
    fontSize: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  card: {
    background: 'var(--bg-card)',
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    borderTop: "3px solid var(--accent-color)",
    padding: "14px 16px",
  },
  cardLabel: {
    color: "#9FB2C8",
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: "0.5px",
  },
  cardValue: {
    color: 'var(--text-primary)',
    fontSize: 28,
    lineHeight: 1.2,
    marginTop: 6,
    fontWeight: 700,
  },
  studentInfoWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  studentInfoCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    padding: "14px 16px",
  },
  studentInfoTitle: {
    color: "var(--accent-color)",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  studentInfoDetail: {
    color: "var(--text-secondary)",
    fontSize: 13,
    lineHeight: 1.45,
    marginTop: 8,
  },
};

export default DashboardShell;
