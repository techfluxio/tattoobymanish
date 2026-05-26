import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar({ menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between transition-colors duration-500 border-none outline-none shadow-none ${
        scrolled
          ? 'bg-white/5 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link to="/" className="group">
        <div className="flex flex-col">
          <span className="font-display text-sm tracking-[0.4em] text-gold uppercase">
            Tattoo By
          </span>
          <span className="font-display text-xl md:text-2xl tracking-[0.15em] text-white font-semibold uppercase leading-tight">
            Manish
          </span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-10 ml-auto">
        {[
          ['/', 'Home'],
          ['/gallery', 'Photos'],
          ['/videos', 'Videos'],
          ['/about', 'About'],
          ['/contact', 'Contact'],
        ].map(([to, label]) => (
          <Link
            key={to}
            to={to}
            className="font-sans text-xs tracking-[0.25em] text-white/60 hover:text-gold uppercase transition-all duration-300 hover:tracking-[0.35em]"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        className="md:hidden flex flex-col gap-[5px] w-8 group ml-6"
        aria-label="Menu"
      >
        <span
          className={`block h-px bg-white transition-all duration-500 ${
            menuOpen ? 'w-8 rotate-45 translate-y-[9px]' : 'w-8'
          }`}
        />
        <span
          className={`block h-px bg-gold transition-all duration-500 ${
            menuOpen ? 'w-0 opacity-0' : 'w-5'
          }`}
        />
        <span
          className={`block h-px bg-white transition-all duration-500 ${
            menuOpen ? 'w-8 -rotate-45 -translate-y-[9px]' : 'w-8'
          }`}
        />
      </button>
    </motion.nav>
  );
}