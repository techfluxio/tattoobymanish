import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('All fields required.'); return; }
    setLoading(true); setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
        className="glass border border-white/5 p-10 w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <span className="font-mono text-xs text-gold/50 tracking-widest uppercase block mb-1">Admin Portal</span>
          <h1 className="font-display text-3xl text-white font-light">TattooByManish</h1>
          <div className="gold-line mx-auto mt-4" />
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 mb-6">
            <div>
              <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none transition-colors placeholder:text-white/20"
                placeholder="Enter username" maxLength={50} />
            </div>
            <div>
              <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none transition-colors placeholder:text-white/20"
                placeholder="Enter password" maxLength={100} />
            </div>
          </div>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-sans text-xs text-red-400/80 mb-4 text-center">{error}</motion.p>}
          <button type="submit" disabled={loading}
            className="btn-gold w-full glass-gold border border-gold/30 py-4 font-sans text-xs text-gold uppercase tracking-[0.25em] transition-all duration-300 disabled:opacity-50">
            {loading ? 'Authenticating…' : 'Access Dashboard'}
          </button>
        </form>
        <p className="text-center font-mono text-xs text-white/15 tracking-widest mt-8 uppercase">Secured · Authorised Personnel Only</p>
      </motion.div>
    </div>
  );
}