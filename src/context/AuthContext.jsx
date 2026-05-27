import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('tbm_token');
    if (!token) { setLoading(false); return; }
    // Verify token is still valid
    api.get('/auth/me')
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        sessionStorage.removeItem('tbm_token');
        sessionStorage.removeItem('tbm_admin');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      sessionStorage.setItem('tbm_token', data.token);
      sessionStorage.setItem('tbm_admin', JSON.stringify(data.admin));
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('tbm_token');
    sessionStorage.removeItem('tbm_admin');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);