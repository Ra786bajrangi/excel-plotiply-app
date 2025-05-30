import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../context/authContext';

export default function Navbar() {
  const { user, logout } = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md h-16 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Excel Dashboard</Link>
        
        <div className="flex space-x-4">
          {user ? (
            <>
              <span className="py-2">Welcome, {user.username}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Admin Panel
                </Link>
              )}
              <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}