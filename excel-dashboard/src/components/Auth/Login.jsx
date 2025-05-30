import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/authContext';
import Lottie from 'lottie-react';
import loginAnimation from '../../assets/login-animation.json';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(authContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 items-center justify-center px-4">
      {/* Left Side: Animation */}
      <div className="md:w-1/2 w-full flex justify-center items-center p-6">
        <Lottie animationData={loginAnimation} className="w-full max-w-md" />
      </div>

      {/* Right Side: Form */}
      <div className="md:w-1/2 w-full p-8">
        <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
          {error && (
            <div className="bg-red-200 text-red-800 p-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-80 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white bg-opacity-80 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded font-semibold hover:from-blue-600 hover:to-cyan-500 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
