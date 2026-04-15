import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import FacilityAdminPage from './pages/FacilityAdminPage';
import FacilityStudentPage from './pages/FacilityStudentPage';
import IncidentList from './pages/IncidentList';
import IncidentDetails from './pages/IncidentDetails';
import CreateIncident from './pages/CreateIncident';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function DashboardRouter() {
  const role = localStorage.getItem('role');
  console.log('Current role from localStorage:', role);

  if (role === 'ADMIN') return <AdminDashboard />;
  if (role === 'STAFF') return <StaffDashboard />;
  if (role === 'TECHNICIAN') return <StaffDashboard />;
  return <StudentDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/facilities"
          element={
            <PrivateRoute>
              <FacilityAdminPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/student/facilities"
          element={
            <PrivateRoute>
              <FacilityStudentPage />
            </PrivateRoute>
          }
        />

        {/* Incident Module Routes */}
        <Route
          path="/incidents"
          element={
            <PrivateRoute>
              <IncidentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/incidents/create"
          element={
            <PrivateRoute>
              <CreateIncident />
            </PrivateRoute>
          }
        />
        <Route
          path="/incidents/:id"
          element={
            <PrivateRoute>
              <IncidentDetails />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;