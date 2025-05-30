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

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* User Management */}
              <div className="bg-gradient-to-br from-white via-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl shadow-lg p-6 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
                <h3 className="text-xl font-bold text-yellow-700 mb-4">👥 User Management</h3>
                <p className="text-sm text-gray-600 mb-4">Add, remove, promote or deactivate users in the system.</p>
                <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-yellow-100 rounded-lg">
                  <AdminUserList />
                </div>
              </div>

             {/* Analytics Section */}
<div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-200 rounded-2xl shadow-lg p-6 transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
  <h3 className="text-xl font-bold text-blue-700 mb-2">📊 Platform Analytics</h3>
  <p className="text-sm text-gray-600 mb-4">Visualize platform activity, user growth, and usage patterns.</p>

  {/* Full-width chart container with good padding */}
  <div className="w-full bg-white/80 rounded-xl p-4 border border-blue-100 shadow-inner">
    <DashboardCharts user={user}  />
  </div>
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
