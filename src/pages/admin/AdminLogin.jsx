import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('All fields required.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = login(username, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #130f08 0%, #080808 70%)' }}>

      {/* Decorative corner lines */}
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
        <div className="absolute top-6 left-6 w-12 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }} />
        <div className="absolute top-6 left-6 w-px h-12" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.5), transparent)' }} />
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
        <div className="absolute top-6 right-6 w-12 h-px" style={{ background: 'linear-gradient(270deg, rgba(201,168,76,0.5), transparent)' }} />
        <div className="absolute top-6 right-6 w-px h-12" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.5), transparent)' }} />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
        <div className="absolute bottom-6 left-6 w-12 h-px" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.5), transparent)' }} />
        <div className="absolute bottom-6 left-6 w-px h-12" style={{ background: 'linear-gradient(0deg, rgba(201,168,76,0.5), transparent)' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
        <div className="absolute bottom-6 right-6 w-12 h-px" style={{ background: 'linear-gradient(270deg, rgba(201,168,76,0.5), transparent)' }} />
        <div className="absolute bottom-6 right-6 w-px h-12" style={{ background: 'linear-gradient(0deg, rgba(201,168,76,0.5), transparent)' }} />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 60%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
        style={{ background: 'rgba(12,10,7,0.9)', border: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(20px)' }}
      >
        {/* Top gold bar */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }} />

        <div className="p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <span className="font-mono text-xs tracking-[0.4em] uppercase block mb-4" style={{ color: 'rgba(201,168,76,0.5)' }}>
                Admin Portal
              </span>
              <div className="font-display font-light text-white mb-1" style={{ fontSize: '1.7rem', letterSpacing: '0.05em' }}>
                Tattoo By
              </div>
              <div className="font-display font-semibold uppercase tracking-widest" style={{ fontSize: '2rem', color: '#C9A84C' }}>
                Manish
              </div>
              <div className="mx-auto mt-5" style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5 mb-7">
              {/* Username */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <label className="font-mono text-xs tracking-[0.3em] uppercase block mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(201,168,76,0.4)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="manish"
                    maxLength={50}
                    style={{
                      width: '100%',
                      background: 'rgba(201,168,76,0.04)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      color: '#ffffff',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.95rem',
                      padding: '0.85rem 1rem 0.85rem 2.75rem',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
                <label className="font-mono text-xs tracking-[0.3em] uppercase block mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'rgba(201,168,76,0.4)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    maxLength={100}
                    style={{
                      width: '100%',
                      background: 'rgba(201,168,76,0.04)',
                      border: '1px solid rgba(201,168,76,0.15)',
                      color: '#ffffff',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.95rem',
                      padding: '0.85rem 3rem 0.85rem 2.75rem',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: showPass ? '#C9A84C' : 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPass
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    }
                  </button>
                </div>
              </motion.div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 px-4 py-3 text-center"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="font-sans text-xs" style={{ color: 'rgba(239,68,68,0.85)' }}>{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 font-mono text-xs uppercase tracking-[0.3em] transition-all duration-300"
              style={{
                background: loading ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.4)',
                color: '#C9A84C',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-3 h-3 border border-gold/60 border-t-transparent rounded-full" />
                  Authenticating
                </span>
              ) : 'Access Dashboard'}
            </motion.button>
          </form>

          <p className="text-center font-mono text-xs mt-8 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.1)' }}>
            Secured · Authorized Personnel Only
          </p>
        </div>

        {/* Bottom gold bar */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
      </motion.div>
    </div>
  );
}
