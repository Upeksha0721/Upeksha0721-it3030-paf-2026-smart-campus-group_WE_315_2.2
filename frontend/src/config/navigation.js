export const navigationByRole = {
  ADMIN: [
    { key: "overview", label: "Overview", icon: "📊", path: "overview" },
    { key: "bookings", label: "Booking Requests", icon: "📅", path: "bookings" },
    { key: "facilities", label: "Facility Catalogue", icon: "🏢", path: "facilities" },
    { key: "incidents", label: "All Incidents", icon: "🔧", path: "incidents" },
    { key: "users", label: "User Management", icon: "👥", path: "users" },
    { key: "reports", label: "Reports", icon: "📈", path: "reports" },
    { key: "settings", label: "Settings", icon: "⚙️", path: "settings" },
  ],
  STAFF: [
    { key: "overview", label: "My Tasks", icon: "✅", path: "overview" },
    { key: "tickets", label: "All Tickets", icon: "🎫", path: "tickets" },
    { key: "completed", label: "Completed", icon: "🏁", path: "completed" },
    { key: "facilities", label: "Facilities", icon: "🏢", path: "facilities" },
    { key: "schedule", label: "Schedule", icon: "📆", path: "schedule" },
    { key: "account", label: "Account", icon: "👤", path: "account" },
  ],
  TECHNICIAN: [
    { key: "overview", label: "My Tasks", icon: "✅", path: "overview" },
    { key: "tickets", label: "All Tickets", icon: "🎫", path: "tickets" },
    { key: "completed", label: "Completed", icon: "🏁", path: "completed" },
    { key: "facilities", label: "Facilities", icon: "🏢", path: "facilities" },
    { key: "schedule", label: "Schedule", icon: "📆", path: "schedule" },
    { key: "account", label: "Account", icon: "👤", path: "account" },
  ],
  USER: [
    { key: "overview", label: "Dashboard", icon: "🏠", path: "overview" },
    { key: "bookings", label: "My Bookings", icon: "📅", path: "bookings" },
    { key: "facilities", label: "Facilities", icon: "🏢", path: "facilities" },
    { key: "incidents", label: "Incidents", icon: "🔧", path: "incidents" },
    { key: "notifications", label: "Notifications", icon: "🔔", path: "notifications" },
    { key: "account", label: "Account", icon: "👤", path: "account" },
  ],
};

export const getRoleNavigation = (role) => {
  if (!role) return navigationByRole.USER;
  return navigationByRole[role] || navigationByRole.USER;
};
