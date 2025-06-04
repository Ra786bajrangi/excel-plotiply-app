import { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardCharts from '../components/DashboardCharts';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setData(res.data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    }
  };

  if (!data) return <div className="p-6 text-gray-500">Loading analytics...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Platform Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Active Users" value={data.activeUsers} />
        <StatCard label="Inactive Users" value={data.inactiveUsers} />
        <StatCard label="Total Uploads" value={data.totalUploads} />
      </div>

      <DashboardCharts analytics={data} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h2>
    </div>
  );
}
