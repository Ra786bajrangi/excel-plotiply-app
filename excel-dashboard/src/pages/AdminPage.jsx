import { useContext } from 'react';
import { FiUsers } from 'react-icons/fi';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { authContext } from '../context/authContext';
import AdminUserList from './AdminUserList';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import ActivityCard from '../components/ActivityCard';

export default function AdminPage() {
  const { user } = useContext(authContext);
  
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-lg border border-white/60 rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-wide flex items-center justify-center gap-3">
  <MdOutlineAdminPanelSettings className="text-5xl text-blue-600" />
  Admin Panel
</h1>
        {user?.role === 'admin' ? (
          <div className="space-y-12">
            {/* Section Header */}
            <div>
              <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">Control Acess By Admin </h2>
              <p className="text-center text-gray-600 text-lg mb-8">Manage users and track analytics in real time.</p>
              <AdminAnalyticsDashboard/>
            </div>

        
          {/* User Management - Full Width */}
<div className="w-full bg-gradient-to-br from-white via-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl shadow-lg p-8 transition-all transform hover:shadow-2xl">
  <div className="mb-6">
    <h3 className="text-2xl font-bold text-yellow-700 mb-2 flex items-center gap-2">
      <FiUsers className="text-3xl" />
      User Management
    </h3>
    <p className="text-gray-700 text-base">
      Manage all registered users — add, remove, promote, active or deactivate accounts with ease.
    </p>
  </div>

  
  

  {/* User List Table or Cards */}
  <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-100 rounded-xl border border-yellow-200 bg-white/50 shadow-inner p-4">
    <AdminUserList />
  </div>
</div>


            {/* Recent Activity */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-6 shadow-md">
              <ActivityCard/>
            
            </div>
          </div>
        ) : (
          <div className="p-6 bg-red-100 text-red-800 rounded-lg text-center font-semibold">
            You don’t have permission to access this page.
          </div>
        )}
      </div>
    </div>
  );
}
