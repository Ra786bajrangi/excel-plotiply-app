import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/authContext';
import UploadHistory from './UploadHistory';


export default function Dashboard() {
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-xl p-8 transition-all duration-500">
        
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Welcome, {user?.username} 
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info Card */}
          <div className="bg-white/50 p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-2xl transition">
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Your Profile</h2>
            <p className="text-gray-700 mb-1"><span className="font-medium">Email:</span> {user?.email}</p>
            <p className="text-gray-700"><span className="font-medium">Role:</span> {user?.role}</p>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/50 p-6 rounded-xl shadow-lg border border-purple-200 hover:shadow-2xl transition">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Quick Actions</h2>
            <button
              onClick={handleEditProfile}
              className="w-full mb-3 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
            {user?.role === 'admin' && (
              <button className="w-full px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"onClick={() => navigate('/user-list')}>
                Manage Users
              </button>
            )}
          </div>
        </div>
        {/* Display uploaded files */}
        <UploadHistory/>
      
      </div>
      
    </div>
  );
}
