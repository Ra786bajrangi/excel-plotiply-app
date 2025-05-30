const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  async getMe() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  logout() {
    localStorage.removeItem('token');
  }
};

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Request failed');
  if (data.token) localStorage.setItem('token', data.token);
  return data;
}

export default authService;