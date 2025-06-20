import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function AiInsightData({ data, className = '' }) {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!data || data.length === 0) {
      setError('Please provide data for analysis');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/analyze`, { data });
      setInsights(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get AI insights');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
              AI Data Insights
            </span>
          </h2>
          <div className="flex space-x-2">
            {insights && (
              <button
                onClick={fetchInsights}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                ↻ Refresh
              </button>
            )}
          </div>
        </div>

        {!insights ? (
          <div className="text-center py-8">
            <button
              onClick={fetchInsights}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${
                isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Generate AI Insights'
              )}
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            
              {insights}
            
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}