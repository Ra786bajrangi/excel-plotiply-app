import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error('Expected an array, got:', res.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const updateRole = async (id, role) => {
    await axios.put(`${API_URL}/admin/users/${id}/role`, { role }, {
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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm) ||
    user.email?.toLowerCase().includes(searchTerm)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField]?.toLowerCase?.() ?? '';
    const bVal = b[sortField]?.toLowerCase?.() ?? '';
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        className="mb-4 p-2 border rounded w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
      />

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort('username')}>Name 🔽</th>
              <th className="p-3 cursor-pointer" onClick={() => toggleSort('email')}>Email 🔽</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Uploads</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">
            {sortedUsers.map(user => (
              <tr
                key={user._id}
                className={user.role === 'admin' ? 'bg-yellow-100 dark:bg-yellow-900' : ''}
              >
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
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
