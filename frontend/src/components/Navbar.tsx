import { NavLink, useNavigate } from 'react-router-dom';
import { Plane, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plane className="h-5 w-5 text-blue-600" />
          <span className="text-lg font-semibold text-gray-800">Tripper</span>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-600' : 'hover:text-gray-800 transition'
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/trips/new"
            className={({ isActive }) =>
              isActive ? 'text-blue-600' : 'hover:text-gray-800 transition'
            }
          >
            New Trip
          </NavLink>
        </nav>

        {/* Action button */}
        <button
          onClick={() => navigate('/trips/new')}
          className="flex items-center gap-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm shadow-sm transition"
        >
          <PlusCircle className="h-4 w-4" />
          Add Trip
        </button>
      </div>
    </header>
  );
}
