import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded hover:bg-blue-700 transition ${
      location.pathname === path ? 'bg-blue-800 text-white' : 'text-white'
    }`;

  return (
    <aside className="fixed top-16 left-0 w-54 h-[calc(100vh-64px)] bg-blue-600">
      <nav className="p-4 flex flex-col space-y-2">
        <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
        <Link to="/upload" className={linkClass('/upload')}>Upload</Link>
        <Link to="/analytics" className={linkClass('/analytics')}>Analytics</Link>
      </nav>
    </aside>
  );
}
