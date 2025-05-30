import Footer from './Footer'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Sidebar />
      <main className="ml-70 mt-18 p-10">
        <Outlet />
      </main>
      <div>
        
      </div>
    </div>
  );
}
