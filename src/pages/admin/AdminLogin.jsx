import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login, isAuthenticated, loading: authLoading, logoutReason, clearLogoutReason } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (logoutReason === 'inactivity') {
      setError('Session expired due to inactivity. Please log in again.');
    }
    return () => clearLogoutReason();
  }, [logoutReason, clearLogoutReason]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) { setError('All fields required.'); return; }
    setLoading(true); setError('');
    const result = await login(username.trim(), password);
    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-gold/20 border-t-gold animate-spin" />
      </div>
    );
  }

  const isInactivity = logoutReason === 'inactivity';

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass border border-white/5 p-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-gold/50 tracking-widest uppercase block mb-1">Admin Portal</span>
          <h1 className="font-display text-3xl text-white font-light">TattooByManish</h1>
          <div className="gold-line mx-auto mt-4" />
        </div>

        {/* Session expired banner */}
        <AnimatePresence>
          {isInactivity && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="border border-gold/20 bg-gold/5 px-4 py-3 flex items-start gap-3">
                <span className="text-gold text-sm mt-0.5 flex-shrink-0">⏱</span>
                <p className="font-sans text-xs text-gold/80 leading-relaxed">
                  Session expired due to inactivity.<br />Please log in again.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate autoComplete="on">
          <div className="space-y-4 mb-6">
            <div>
              <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                spellCheck={false}
                className="w-full bg-[#1a1a1a] border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none transition-colors placeholder:text-white/20"
                placeholder="Enter username"
                maxLength={50}
              />
            </div>
            <div>
              <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-[#1a1a1a] border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none transition-colors placeholder:text-white/20"
                placeholder="Enter password"
                maxLength={100}
              />
            </div>
          </div>

          <AnimatePresence>
            {error && !isInactivity && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-sans text-xs text-red-400/80 mb-4 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full glass-gold border border-gold/30 py-4 font-sans text-xs text-gold uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-3 h-3 border border-gold/40 border-t-gold rounded-full animate-spin inline-block" />
            )}
            {loading ? 'Authenticating…' : 'Access Dashboard'}
          </button>
        </form>

        <p className="text-center font-mono text-xs text-white/15 tracking-widest mt-8 uppercase">
          Secured · Authorised Personnel Only
        </p>
      </motion.div>
    </div>
  );
}