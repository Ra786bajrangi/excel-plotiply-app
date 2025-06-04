import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import Dashboard from './components/Dashboard';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import NotFound from './pages/NotFound';

import Layout from './components/Layout'; // NEW layout wrapper
import ExcelDashboard from './components/ExcelDashboard';
import AnalysisComponent from './components/AnalysisSection';
import AdminUserList from './pages/AdminUserList';
import AdminAnalyticsDashboard from './pages/AdminAnalyticsDashboard';
import DashboardCharts from './components/DashboardCharts';

import UpdateProfile from './components/UpdateProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes without layout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<ExcelDashboard/>}/>
              <Route path="/analytics" element={<AnalysisComponent/>}/>
              <Route path='/update'element={<UpdateProfile/>}/>
              <Route path="/profile" element={<UserPage />} />
            </Route>
          </Route>

          {/* Admin-only Routes inside Layout */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path='/adminuser' element={<AdminUserList/>}/>
              <Route path='/adminanalytics' element={<AdminAnalyticsDashboard/>}/>
              <Route path='/charts' element={<DashboardCharts/>}/>
            </Route>
          </Route>

          {/* 404 - Not Found Page (Optional) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* ✅ Toast notifications container */}
          <ToastContainer position="top-right" autoClose={3000} />
        
      </Router>
    </AuthProvider>
  );
}

export default App;
