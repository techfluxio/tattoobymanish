import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useInView } from 'react-intersection-observer';

/* ─── Cinematic quotes data ─── */
const CINEMATIC_QUOTES = [
  { quote: "Ink is the language of those who refuse to be forgotten.", author: "Unknown" },
  { quote: "Your skin is the canvas. Your story is the art.", author: "Unknown" },
  { quote: "Every scar has a story. Every tattoo has a soul.", author: "Unknown" },
  { quote: "The only thing permanent is the art you choose to carry.", author: "Unknown" },
  { quote: "Tattoos are love letters written in pain and pride.", author: "Unknown" },
  { quote: "Tattoos are love letters written in pain and pride.", author: "Unknown" },
];

/* ─── Floating gold particle ─── */
function GoldParticle({ x, y, size, duration, delay, opacity }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(201,168,76,${opacity}) 0%, transparent 70%)`,
        filter: 'blur(0.5px)',
      }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 8, -8, 4, 0],
        opacity: [opacity * 0.4, opacity, opacity * 0.6, opacity * 0.9, opacity * 0.4],
        scale: [1, 1.3, 0.9, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── Generate particle configs once ─── */
const LEFT_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 12 + 1,
  y: Math.random() * 90 + 5,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 6 + 6,
  delay: Math.random() * 4,
  opacity: Math.random() * 0.4 + 0.1,
}));

const RIGHT_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 12 + 87,
  y: Math.random() * 90 + 5,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 6 + 6,
  delay: Math.random() * 4,
  opacity: Math.random() * 0.4 + 0.1,
}));

/* ─── Noise grain canvas overlay ─── */
function GrainOverlay() {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    const draw = () => {
      frame++;
      if (frame % 3 !== 0) { frameRef.current = requestAnimationFrame(draw); return; } // 20fps grain
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v * 0.85;
        data[i + 2] = v * 0.6;
        data[i + 3] = Math.random() * 18; // very subtle
      }
      ctx.putImageData(imageData, 0, 0);
      frameRef.current = requestAnimationFrame(draw);
    };
    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 pointer-events-none"
      style={{ mixBlendMode: 'overlay', opacity: 0.35 }}
    />
  );
}

/* ─── Mouse-follow glow ─── */
function MouseGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-30 transition-opacity duration-700"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(201,168,76,0.02) 40%, transparent 70%)',
        borderRadius: '50%',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.7s ease',
      }}
    />
  );
}

/* ─── Animated edge lines ─── */
function EdgeLines() {
  return (
    <>
      {/* Top edge */}
      <div className="absolute top-0 left-0 right-0 z-25 h-px overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 0.5 }}
          className="h-px w-1/3"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.7), transparent)' }}
        />
      </div>
      {/* Bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 z-25 h-px overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="h-px w-1/3"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.6), transparent)' }}
        />
      </div>
      {/* Left edge */}
      <div className="absolute top-0 bottom-0 left-0 z-25 w-px overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', delay: 1 }}
          className="w-px h-1/3"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.6), transparent)' }}
        />
      </div>
      {/* Right edge */}
      <div className="absolute top-0 bottom-0 right-0 z-25 w-px overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: ['100%', '-100%'] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'linear', delay: 2 }}
          className="w-px h-1/3"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.5), transparent)' }}
        />
      </div>
    </>
  );
}

/* ─── Sub-components ─── */
function StatItem({ value, label, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.7 }} className="text-center">
      <div className="font-display text-3xl md:text-4xl text-gold font-light">{value}</div>
      <div className="font-sans text-xs text-white/40 tracking-widest uppercase mt-1">{label}</div>
    </motion.div>
  );
}

function FeaturedWork({ src, title, category, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.8 }}
      className="img-hover relative group cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden">
        <img src={src} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
        <div>
          <p className="font-sans text-xs text-gold tracking-widest uppercase">{category}</p>
          <p className="font-display text-xl text-white">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}

function QuoteCard({ quote, author, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative px-6 py-8 border border-white/5 glass group hover:border-gold/20 transition-all duration-700"
    >
      <div className="absolute top-0 left-8 w-8 h-px bg-gold/40 group-hover:w-16 transition-all duration-700" />
      <div className="font-display text-5xl text-gold/15 leading-none mb-3 select-none">"</div>
      <p className="font-body text-white/60 text-base md:text-lg leading-relaxed italic mb-6 group-hover:text-white/80 transition-colors duration-500">
        {quote}
      </p>
      <div className="flex items-center gap-3">
        <div className="w-6 h-px bg-gold/40" />
        <span className="font-mono text-xs text-gold/60 tracking-widest uppercase">{author}</span>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const videoRef = useRef(null);
  const { images } = useData();
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
      videoRef.current.play().catch(() => { });
    }
  }, []);

  const featured = images.slice(0, 3);

  return (
    <div className="bg-obsidian min-h-screen">
      {/* Mouse glow — fixed, sits above everything */}
      <MouseGlow />

      {/* Hero */}
      <section className="relative h-screen overflow-hidden flex items-center justify-center">

        {/* ── Video with subtle zoom-in ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            style={{ transformOrigin: 'center center' }}
          >
            <video
              ref={videoRef}
              autoPlay muted loop playsInline
              onCanPlay={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-[2000ms] ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
              src="/hero-bg.mp4"
            />
          </motion.div>
          {!videoLoaded && (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1412 50%, #0d0d0d 100%)' }} />
          )}
        </div>

        {/* ── Dark overlay ── */}
        <div className="absolute inset-0 z-10" style={{ background: 'rgba(0,0,0,0.55)' }} />
        <div className="absolute inset-0 cinematic-overlay z-10" />
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(8,8,8,0.5) 0%, transparent 40%, transparent 60%, rgba(8,8,8,0.5) 100%)' }} />
        <div className="absolute inset-0 z-10" style={{ boxShadow: 'inset 0 0 200px rgba(0,0,0,0.7)' }} />

        {/* ── Grain overlay ── */}
        <GrainOverlay />

        {/* ── Floating particles left & right ── */}
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          {LEFT_PARTICLES.map(p => <GoldParticle key={`l${p.id}`} {...p} />)}
          {RIGHT_PARTICLES.map(p => <GoldParticle key={`r${p.id}`} {...p} />)}
        </div>

        {/* ── Animated edge lines ── */}
        <EdgeLines />

        {/* ── Hero Content ── */}
        <div className="relative z-30 text-center px-6 max-w-5xl mx-auto">

          {/* Title — slow fade-up */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-light text-white leading-none mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 9rem)', letterSpacing: '-0.02em' }}
          >
            Timeless Art
            <motion.span
              className="block italic text-gold-gradient font-normal"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Carved Into Skin
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.6, duration: 1.2 }}
            className="gold-line mx-auto mb-10"
          />

          {/* Buttons with glow hover */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/gallery"
              className="btn-gold glass border border-gold/30 px-8 py-4 font-sans text-xs text-gold uppercase tracking-[0.25em] transition-all duration-400"
              style={{ '--glow-color': 'rgba(201,168,76,0.35)' }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow =
                  '0 0 28px rgba(201,168,76,0.35), 0 0 60px rgba(201,168,76,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              Photos
            </Link>

            <Link
              to="/videos"
              className="btn-gold glass border border-gold/30 px-8 py-4 font-sans text-xs text-gold uppercase tracking-[0.25em] transition-all duration-400"
              style={{ '--glow-color': 'rgba(201,168,76,0.35)' }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow =
                  '0 0 28px rgba(201,168,76,0.35), 0 0 60px rgba(201,168,76,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '';
              }}
            >
              Videos
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 pointer-events-none"
        >
          <span className="font-mono text-xs text-white/25 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-16 overflow-hidden">
            <motion.div
              animate={{ y: [-64, 64] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-px h-16"
              style={{ background: 'linear-gradient(to bottom, transparent, #C9A84C, transparent)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats
      <section className="py-16 md:py-20 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatItem value="500+" label="Tattoos Done" delay={0} />
          <StatItem value="10+" label="Years Experience" delay={0.1} />
          <StatItem value="50+" label="Styles Mastered" delay={0.2} />
          <StatItem value="100%" label="Custom Designs" delay={0.3} />
        </div>
      </section> */}

      {/* Featured Work */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="font-mono text-xs text-gold tracking-widest uppercase block mb-3">
              Selected Works
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-4xl md:text-6xl text-white font-light">
              Recent <em>Art</em>
            </motion.h2>
          </div>
          <Link to="/gallery" className="hidden md:flex font-sans text-xs text-gold tracking-widest uppercase items-center gap-3 hover:gap-5 transition-all duration-300">
            View All <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {featured.map((img, i) => (
            <FeaturedWork key={img.id} src={img.src} title={img.title} category={img.category} delay={i * 0.15} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/gallery" className="md:hidden btn-gold glass-gold border border-gold/30 px-8 py-4 font-sans text-xs text-gold uppercase tracking-[0.2em] inline-block">
            View All Work
          </Link>
        </div>
      </section>

      {/* Cinematic Quotes */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #080808 0%, #100d08 50%, #080808 100%)' }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <span className="font-display text-[25vw] text-gold font-bold">INK</span>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="font-mono text-xs text-gold tracking-widest uppercase block mb-3">
              The Philosophy
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-display text-4xl md:text-5xl text-white font-light">
              Words on <em className="text-gold-gradient">Ink</em>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CINEMATIC_QUOTES.map((q, i) => (
              <QuoteCard key={i} quote={q.quote} author={q.author} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
