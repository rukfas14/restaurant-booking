import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, getUser } from '../lib/api.js';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-warm-900 text-warm-50'
        : 'text-warm-50/80 hover:bg-warm-800'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-warm-900 text-warm-50 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="font-bold text-lg">
              {user?.restaurant?.name || 'Booking Dashboard'}
            </div>
            <nav className="flex gap-1">
              <NavLink to="/" end className={linkClass}>
                Rezervacije
              </NavLink>
              <NavLink to="/settings" className={linkClass}>
                Postavke
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-warm-50/70 hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-warm-800 hover:bg-warm-600 px-3 py-1.5 rounded-md"
            >
              Odjava
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
