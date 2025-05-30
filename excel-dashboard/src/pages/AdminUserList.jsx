import { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // Defensive check: only set users if it's actually an array
    if (Array.isArray(res.data)) {
      setUsers(res.data);
    } else {
      console.error('Expected an array, got:', res.data);
      setUsers([]); // fallback to empty array
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    setUsers([]); // fallback on error
  }
};


  const updateRole = async (id, role) => {
    await axios.put(`api/admin/users/${id}/role`, { role }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchUsers();
  };

  const toggleStatus = async (id, isActive) => {
    await axios.put(`${API_URL}/admin/users/${id}/status`, { isActive }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
               <th className="p-3">Actions</th>
               <th className="p-3">Uploads</th>
               
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">
            {users.map(user => (
              <tr key={user._id}>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <button
                    className={`px-3 py-1 rounded text-white ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => toggleStatus(user._id, !user.isActive)}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
                <td className="p-3 text-center">
        {user.uploadCount ?? user.uploadedFiles?.length ?? 0}
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
