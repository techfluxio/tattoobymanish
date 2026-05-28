import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Block back-button access after logout by replacing history entry
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-gold/20 border-t-gold animate-spin" />
          <span className="font-mono text-xs text-white/25 tracking-widest uppercase">Verifying session</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}