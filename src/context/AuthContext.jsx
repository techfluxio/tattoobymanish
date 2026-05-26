import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// In production, use env variables & backend auth. This is a client-side demo.
const ADMIN_CREDENTIALS = {
  username: process.env.REACT_APP_ADMIN_USER || 'manish',
  // In production: compare against bcrypt hash via secure API
  passwordHash: process.env.REACT_APP_ADMIN_PASS || 'TattooByManish@2024!'
};

const RATE_LIMIT = { max: 5, window: 15 * 60 * 1000 };

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState([]);

  useEffect(() => {
    const session = sessionStorage.getItem('tbm_admin_session');
    if (session) {
      try {
        const { token, exp } = JSON.parse(atob(session));
        if (token === 'tbm_authenticated' && exp > Date.now()) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem('tbm_admin_session');
        }
      } catch { sessionStorage.removeItem('tbm_admin_session'); }
    }
  }, []);

  const login = (username, password) => {
    const now = Date.now();
    const recent = loginAttempts.filter(t => now - t < RATE_LIMIT.window);
    if (recent.length >= RATE_LIMIT.max) {
      return { success: false, error: 'Too many attempts. Please wait 15 minutes.' };
    }
    setLoginAttempts(prev => [...prev.filter(t => now - t < RATE_LIMIT.window), now]);
    const sanitizedUser = username.replace(/[<>"'/]/g, '');
    if (sanitizedUser === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.passwordHash) {
      const session = btoa(JSON.stringify({ token: 'tbm_authenticated', exp: Date.now() + 8 * 60 * 60 * 1000 }));
      sessionStorage.setItem('tbm_admin_session', session);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials.' };
  };

  const logout = () => {
    sessionStorage.removeItem('tbm_admin_session');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
