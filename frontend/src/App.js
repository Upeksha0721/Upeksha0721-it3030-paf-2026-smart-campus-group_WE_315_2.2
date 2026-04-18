import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import OAuthCallback from './pages/OAuthCallback';
import IncidentList from './pages/IncidentList';
import IncidentDetails from './pages/IncidentDetails';
import CreateIncident from './pages/CreateIncident';
import DashboardShell from './pages/DashboardShell';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/callback" element={<OAuthCallback />} />

        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <DashboardShell />
            </PrivateRoute>
          }
        />

        <Route path="/admin/facilities" element={<Navigate to="/dashboard/facilities" replace />} />
        <Route path="/student/facilities" element={<Navigate to="/dashboard/facilities" replace />} />

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