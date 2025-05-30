import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authContext } from '../context/authContext.jsx';

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useContext(authContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}