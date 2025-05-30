import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/authContext';
import Lottie from 'lottie-react';
import registerAnimation from '../../assets/Register-animation.json';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const { register } = useContext(authContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 items-center justify-center px-4">
      {/* Left Side: Lottie Animation */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-6">
        <Lottie animationData={registerAnimation} className="w-full max-w-md" />
      </div>

      {/* Right Side: Register Form */}
      <div className="md:w-1/2 w-full p-8">
        <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
          {error && (
            <div className="bg-red-200 text-red-800 p-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-80 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-80 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-80 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-80 focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded font-semibold hover:from-blue-500 hover:to-green-400 transition-all"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
