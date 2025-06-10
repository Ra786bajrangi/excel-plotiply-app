
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

export default function DashboardCharts({ analytics } ) {
  if (!analytics) {
    return (
      <div className="text-gray-500 text-center py-10">
        Loading analytics data...
      </div>
    );
  }
  const statusData = [
    { name: 'Active', value: analytics.activeUsers },
    { name: 'Inactive', value: analytics.inactiveUsers },
  ];

  const uploadData = analytics.uploadsByUser?.map(user => ({
    name: user.username ?? 'Unknown',
    uploads: user.uploadCount ?? 0
  })) ?? [];
  
  return (
    <div className="mt-10 space-y-10">
      <div>
        <h2 className="text-xl font-semibold mb-4">User Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" name="user Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">User Upload Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={uploadData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uploads" stroke="#10b981" name="Uploads" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
