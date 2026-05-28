import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useInactivity } from '../hooks/useInactivity';

const AuthContext = createContext(null);

const TOKEN_KEY = 'tbm_token';
const ADMIN_KEY = 'tbm_admin';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading,         setLoading]         = useState(true);
  // null | 'inactivity' | 'manual'
  const [logoutReason,    setLogoutReason]    = useState(null);

  // ── Restore session on mount ─────────────────────────────────────────────
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }

    api.get('/auth/me')
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ADMIN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Inactivity logout ────────────────────────────────────────────────────
  const handleInactivity = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAuthenticated(false);
    setLogoutReason('inactivity');
  }, []);

  useInactivity(handleInactivity, isAuthenticated);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      sessionStorage.setItem(TOKEN_KEY, data.token);
      sessionStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
      setIsAuthenticated(true);
      setLogoutReason(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback((reason = 'manual') => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAuthenticated(false);
    setLogoutReason(reason);
  }, []);

  const clearLogoutReason = useCallback(() => setLogoutReason(null), []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      logoutReason,
      login,
      logout,
      clearLogoutReason,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);