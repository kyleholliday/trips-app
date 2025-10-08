import { Outlet, Link, NavLink } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-semibold">
            Trips
          </Link>
          <div className="flex gap-4">
            <NavLink to="/" className="hover:underline">
              Home
            </NavLink>
            <NavLink to="/trips/new" className="hover:underline">
              New Trip
            </NavLink>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
