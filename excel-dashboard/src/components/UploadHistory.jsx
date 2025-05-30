import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiTrash2, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

const UploadHistory = ({ token }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      const authToken = token || localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setHistory(res.data.uploadedFiles || []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async (fileId) => {
    console.log("Deleting file with ID:", fileId);
  
    try {
      setDeletingId(fileId);
      const authToken = token || localStorage.getItem('token');
      await axios.delete(`${API_URL}/upload/${fileId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      alert('File deleted successfully');
      setHistory(prev => prev.filter(file => file._id !== fileId));
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };
  

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-10">
      <FiLoader className="animate-spin text-3xl text-blue-600 dark:text-blue-400" />
    </div>
  );

  if (error) return (
    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg text-center">
      Error loading history: {error}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        Upload History
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic text-center">No files found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {history.map((file, index) => {
            const date = new Date(file.uploadDate || file.createdAt);
            const isValidDate = !isNaN(date.getTime());

            return (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 break-words">
                    {file.filename}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {isValidDate ? date.toLocaleString() : 'Unknown date'}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deletingId === file._id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete"
                  >
                    {deletingId === file._id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <>
                        <FiTrash2 />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UploadHistory;
