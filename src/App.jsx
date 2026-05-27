import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import FullscreenMenu from './components/layout/FullscreenMenu';

import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Videos from './pages/Videos';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import ProtectedRoute from './components/admin/ProtectedRoute';

import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

import './styles/globals.css';

function AppContent() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // Detect admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Public Navbar ONLY on website pages */}
      {!isAdminRoute && (
        <Navbar
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}

      {/* Public Fullscreen Menu ONLY on website pages */}
      <AnimatePresence>
        {!isAdminRoute && menuOpen && (
          <FullscreenMenu setMenuOpen={setMenuOpen} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}