import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../context/authContext';

export default function HomePage() {
  const { user } = useContext(authContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          {user ? `Welcome back, ${user.username}!` : 'Welcome to ExcelApp'}
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          {user 
            ? 'You are now logged in to your account.'
            : 'A secure authentication system built with React, Node.js, and MongoDB'
          }
        </p>
        
        <div className="flex justify-center space-x-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
        
        {user?.role === 'admin' && (
          <div className="mt-10 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-yellow-800">
              You have admin privileges. <Link to="/admin" className="underline">Access admin panel</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}