import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useData } from '../context/DataContext';
import PageTransition from '../components/ui/PageTransition';

const INITIAL_COUNT = 4;
const LOAD_MORE = 2;

function VideoCard({ video, onClick }) {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: false });

  useEffect(() => {
    if (!videoRef.current) return;
    if (inView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="video-card group cursor-pointer"
      onClick={() => onClick(video)}
    >
      <div className="aspect-video overflow-hidden relative">
        <video
          ref={videoRef}
          src={video.src}
          muted loop playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          poster={video.thumbnail}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 glass-gold border border-gold/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 scale-90 group-hover:scale-100">
            <div className="w-0 h-0 ml-1" style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '14px solid #C9A84C' }} />
          </div>
        </div>
        {/* Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-1">{video.category}</p>
          <p className="font-display text-xl text-white">{video.title}</p>
          <p className="font-mono text-xs text-white/40 mt-1">{video.duration}</p>
        </div>
      </div>
    </motion.div>
  );
}

function VideoPlayer({ video, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', esc); };
  }, [onClose]);

  useEffect(() => {
    if (videoRef.current) {
      playing ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
    }
  }, [playing]);

  useEffect(() => { if (videoRef.current) videoRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = speed; }, [speed]);

  const onTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setProgress(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  }, []);

  const seek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.97)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
        className="w-full max-w-4xl mx-auto px-4 md:px-6 py-6 max-h-screen overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <p className="font-sans text-xs text-gold tracking-widest uppercase">{video.category}</p>
            <p className="font-display text-xl text-white">{video.title}</p>
          </div>
          <button onClick={onClose} className="sticky top-4 z-50 w-10 h-10 glass border border-white/10 text-white/60 hover:text-white flex items-center justify-center rounded-full text-lg transition-all duration-300 hover:border-gold/40">
            ×
          </button>
        </div>

        {/* Video */}
        <div className="relative bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={video.src}
            autoPlay
            onTimeUpdate={onTimeUpdate}
            className="w-full object-contain bg-black max-h-[55vh] md:max-h-[65vh] lg:max-h-[72vh]"
          />
        </div>

        {/* Controls */}
        <div className="glass border border-white/5 p-4 mt-1">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-white/40 w-10">{fmt(progress)}</span>
            <div className="flex-1 h-1 bg-white/10 cursor-pointer relative" onClick={seek}>
              <div className="h-full bg-gold transition-all" style={{ width: duration ? `${(progress/duration)*100}%` : '0%' }} />
            </div>
            <span className="font-mono text-xs text-white/40 w-10">{fmt(duration)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={() => setPlaying(p => !p)} className="w-10 h-10 glass-gold border border-gold/30 flex items-center justify-center text-gold hover:border-gold transition-colors">
              {playing ? '⏸' : '▶'}
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/30">Vol</span>
              <input type="range" min="0" max="1" step="0.05" value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-gold" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/30">Speed</span>
              <select value={speed} onChange={e => setSpeed(parseFloat(e.target.value))}
                className="bg-transparent border border-white/10 text-white/60 font-mono text-xs px-2 py-1">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => <option key={s} value={s}>{s}×</option>)}
              </select>
            </div>

            <button onClick={toggleFullscreen} className="ml-auto font-mono text-xs text-white/40 hover:text-gold transition-colors tracking-wider">
              {fullscreen ? 'EXIT FULL' : 'FULLSCREEN'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Videos() {
  const { videos, categories } = useData();

  const [count, setCount] = useState(INITIAL_COUNT);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter videos by category
  const filtered =
    activeCategory === 'All'
      ? videos
      : videos.filter(v => v.category === activeCategory);

  const visible = filtered.slice(0, count);

  const hasMore = count < filtered.length;

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setCount(INITIAL_COUNT);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xs text-gold tracking-widest uppercase block mb-3"
          >
            Studio Reel
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-5xl md:text-7xl text-white font-light mb-10"
          >
            Videos
          </motion.h1>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat, i) => (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2 font-sans text-xs tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'border-gold text-gold glass-gold'
                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {visible.map(v => (
              <VideoCard
                key={v.id}
                video={v}
                onClick={setActiveVideo}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-14">
              <button
                onClick={() => setCount(c => c + LOAD_MORE)}
                className="btn-gold glass-gold border border-gold/30 px-10 py-4 font-sans text-xs text-gold uppercase tracking-[0.25em]"
              >
                Load More Videos
              </button>
            </div>
          )}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-24 text-white/30 font-display text-2xl italic">
              No videos in this category yet.
            </div>
          )}
        </div>
      </div>

      {/* Video Player */}
      <AnimatePresence>
        {activeVideo && (
          <VideoPlayer
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}