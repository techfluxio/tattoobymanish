import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', num: '01' },
  { to: '/gallery', label: 'Photos', num: '02' },
  { to: '/videos', label: 'Videos', num: '03' },
  { to: '/about', label: 'About Me', num: '04' },
  { to: '/contact', label: 'Contact', num: '05' },
];

export default function FullscreenMenu({ setMenuOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 flex"
      style={{ background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(24px)' }}
    >
      {/* Main nav */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-20">
        <nav className="space-y-1">
          {links.map(({ to, label, num }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={to}
                onClick={() => setMenuOpen(false)}
                className="group flex items-baseline gap-6 py-4 border-b border-white/5 hover:border-gold/30 transition-all duration-500"
              >
                <span className="font-mono text-xs text-white/20 group-hover:text-gold/60 transition-colors">{num}</span>
                <span className="font-display text-4xl md:text-6xl text-white/80 group-hover:text-white font-light tracking-tight transition-all duration-500 group-hover:translate-x-3">
                  {label}
                </span>
                <span className="ml-auto font-sans text-xs tracking-widest text-white/0 group-hover:text-gold uppercase transition-all duration-500">View →</span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex gap-8"
        >
          {['Instagram', 'WhatsApp', 'YouTube'].map(s => (
            <a key={s} href="#" className="font-sans text-xs tracking-widest text-white/25 hover:text-gold uppercase transition-all duration-300">{s}</a>
          ))}
        </motion.div>
      </div>

      {/* Gold accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute right-0 top-0 w-px h-full origin-top"
        style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C40, transparent)' }}
      />
    </motion.div>
  );
}
