import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Bookings from './pages/Bookings.jsx';
import Settings from './pages/Settings.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import { getToken } from './lib/api.js';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Bookings />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
