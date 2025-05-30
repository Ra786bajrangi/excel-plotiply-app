import { createContext, useState, useEffect } from 'react';
import authService from '../api/auth.js';

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const register = async (userData) => {
    const registeredUser = await authService.register(userData);
    setUser(registeredUser);
    return registeredUser;
  };

  const login = async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </authContext.Provider>
  );
};