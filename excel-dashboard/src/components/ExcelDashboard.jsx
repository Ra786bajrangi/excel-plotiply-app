import { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL;

export default function ExcelDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [excelData, setExcelData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setStatus('');
    setExcelData([]);
    setColumns([]);
  };

  const processExcel = async (fileBuffer) => {
    const workbook = XLSX.read(fileBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    if (data.length === 0) throw new Error('Excel file is empty');

    const availableColumns = Object.keys(data[0]).filter(key =>
      data.some(row => row[key] !== undefined && row[key] !== null)
    );

    
    return { data, columns: availableColumns };

  };

  const handleUpload = async (e) => {
  e.preventDefault();

  if (!file) {
    setStatus('Please select a file first');
    return;
  }

  try {
    const fileBuffer = await file.arrayBuffer();
    
    // Destructure correctly from processExcel
    const { data, columns: parsedColumns } = await processExcel(fileBuffer);

    // Save data in localStorage if it exists
    if (data && parsedColumns && parsedColumns.length > 0) {
      localStorage.setItem('excelData', JSON.stringify(data));
      localStorage.setItem('columns', JSON.stringify(parsedColumns));
    } else {
      throw new Error('Parsed data or columns are empty');
    }

    // Also send to backend (optional)
    const formData = new FormData();
    formData.append('file', file);

    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    setStatus('File processed successfully!');

    // Navigate to analysis page (no need to pass state anymore)
    navigate('/analytics');

  } catch (error) {
    console.error('Processing error:', error);
    setStatus(`Error: ${error.message}`);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Excel Dashboard</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Excel</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">{file ? file.name : 'XLSX or XLS files'}</p>
                </div>
                <input 
                  type="file" 
                  accept=".xlsx,.xls" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-md"
              disabled={!file}
            >
              {!file ? 'Select a file first' : 'Upload & Process'}
            </button>
            {status && (
              <div className={`p-3 rounded-lg ${status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
