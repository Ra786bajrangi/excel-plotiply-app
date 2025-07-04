import { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
const API_URL = import.meta.env.VITE_API_URL;

export default function ActivityCard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API_URL}/activities`, {
        withCredentials: true, 
      });

      setActivities(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load activities.");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActionColor = (action) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'upload': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-4">Loading activities...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white/80 border border-gray-200 rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No activities found</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity._id} className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{activity.user?.username || "Unknown User"}</span>
                  <span className="text-gray-600 ml-2">{activity.details}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
