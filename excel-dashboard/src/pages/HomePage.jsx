import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { authContext } from '../context/authContext';
import { Typewriter } from 'react-simple-typewriter';
import Lottie from 'lottie-react';
import dataFlow from '../assets/dataflow.json'

export default function LandingPage() {
  const { user } = useContext(authContext);

  return (
    <div className="bg-gradient-to-br from-[#e0ecff] via-[#f7f3ff] to-[#e1f4ff] text-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <Lottie
          animationData={dataFlow}
          loop
          autoPlay
          className="absolute inset-0 w-full h-full opacity-30 -z-0"
        />
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-10 text-center shadow-xl max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Excel{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              <Typewriter
                words={['Visualization', 'Analytics', 'Dashboard']}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            A modern platform to upload, analyze, and visualize Excel data using
            React, Node.js, MongoDB, and advanced charting tools.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose ExcelApp?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Upload Excel Files',
              desc: 'Easily upload and manage Excel (.xlsx) files with record tracking.',
            },
            {
              title: 'Visualize in 2D/3D',
              desc: 'Generate dynamic and interactive charts including 3D Plotly and Chart.js.',
            },
            {
              title: 'User & Admin Dashboard',
              desc: 'Clean dashboards for users and role-based access for admins.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-xl shadow-lg text-center"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              step: '1. Upload',
              desc: 'Choose and upload your Excel file securely.',
            },
            {
              step: '2. Analyze',
              desc: 'Select columns and generate charts in seconds.',
            },
            {
              step: '3. Download & Share',
              desc: 'Download visualizations or share them directly.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/30 backdrop-blur-lg border-l-4 border-blue-500 p-6 rounded-lg shadow-md"
            >
              <h4 className="font-bold text-xl">{item.step}</h4>
              <p className="text-gray-700 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Visualizing Your Excel Data Today</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join a growing community of data enthusiasts. Turn your raw Excel files into
          beautiful, insightful charts.
        </p>
        <Link
          to={user ? '/dashboard' : '/register'}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg"
        >
          {user ? 'Go to Dashboard' : 'Get Started'}
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white/20 backdrop-blur-md border-t border-gray-200 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} ExcelApp. Built with ❤️ by Rakesh Ranjan Behera.
      </footer>
    </div>
  );
}
