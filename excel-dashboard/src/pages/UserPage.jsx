import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';  

import { authContext } from '../context/authContext';
import { User, Mail, Shield, Lock, Pencil } from 'lucide-react';

export default function UserPage() {
  const { user } = useContext(authContext);
  const navigate = useNavigate();  
   
  const handleUpdateProfile = () => {
    navigate('/update');  // Navigate to update profile page
  };
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="text-blue-600" /> User Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-6 bg-gray-50 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium text-gray-800">{user?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="font-medium text-gray-800 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-blue-700 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <button className="flex items-center gap-2 w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition">
                  <Lock size={18} /> Change Password
                </button>
                <button
  onClick={handleUpdateProfile}
  className="flex items-center gap-2 w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition"
>
  <Pencil size={18} /> Update Profile
</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
