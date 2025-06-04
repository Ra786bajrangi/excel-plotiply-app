import { useContext } from 'react';
import { authContext } from '../context/authContext';
import AdminUserList from './AdminUserList';
import AdminAnalyticsDashboard from './AdminAnalyticsDashboard';
import DashboardCharts from '../components/DashboardCharts';
export default function AdminPage() {
  const { user } = useContext(authContext);
  
  


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-lg border border-white/60 rounded-2xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center tracking-wide">🌟 Admin Dashboard</h1>

        {user?.role === 'admin' ? (
          <div className="space-y-12">
            {/* Section Header */}
            <div>
              <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">Control Panel</h2>
              <p className="text-center text-gray-600 text-lg mb-8">Manage users and track analytics in real time.</p>
              <AdminAnalyticsDashboard/>
            </div>

        
          {/* User Management - Full Width */}
<div className="w-full bg-gradient-to-br from-white via-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl shadow-lg p-8 transition-all transform hover:shadow-2xl">
  <div className="mb-6">
    <h3 className="text-2xl font-bold text-yellow-700 mb-2 flex items-center gap-2">
      👥 User Management
    </h3>
    <p className="text-gray-700 text-base">
      Manage all registered users — add, remove, promote, or deactivate accounts with ease.
    </p>
  </div>

  {/* Controls Placeholder (e.g., search/filter) */}
  <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div className="w-full sm:w-1/2">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />
    </div>
    {/* Add any control buttons here */}
    <div className="flex gap-2">
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition">Add User</button>
      <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-300 transition">Export</button>
    </div>
  </div>

  {/* User List Table or Cards */}
  <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-100 rounded-xl border border-yellow-200 bg-white/50 shadow-inner p-4">
    <AdminUserList />
  </div>
</div>


            {/* Recent Activity */}
            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">Recent Activity</h3>
              <ul className="space-y-3">
                <li className="bg-white/80 p-3 rounded shadow-sm">New user registered.</li>
                <li className="bg-white/80 p-3 rounded shadow-sm">System backup completed successfully.</li>
                <li className="bg-white/80 p-3 rounded shadow-sm">Admin updated site configuration.</li>
              </ul>
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
