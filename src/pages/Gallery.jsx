import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import { useData } from '../context/DataContext';
import PageTransition from '../components/ui/PageTransition';

const INITIAL_COUNT = 6;
const LOAD_MORE_COUNT = 4;

function Lightbox({ image, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl max-h-[90vh] mx-6"
        onClick={e => e.stopPropagation()}
      >
        <img src={image.src} alt={image.title} className="max-h-[80vh] max-w-full object-contain" />
        <div className="absolute bottom-0 left-0 right-0 p-6 glass border-t border-white/5">
          <p className="font-sans text-xs text-gold tracking-widest uppercase">{image.category}</p>
          <p className="font-display text-xl text-white">{image.title}</p>
        </div>
        <button onClick={onClose} className="absolute -top-4 -right-4 w-10 h-10 glass border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors text-lg font-light rounded-full">
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}

function GalleryItem({ image, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="mb-4 img-hover group cursor-pointer relative"
      onClick={() => onClick(image)}
    >
      <img
        src={image.src}
        alt={image.title}
        className="w-full h-auto block"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
        <div>
          <p className="font-sans text-xs text-gold tracking-widest uppercase">{image.category}</p>
          <p className="font-display text-base text-white">{image.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const { images, categories } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const [count, setCount] = useState(INITIAL_COUNT);
  const [lightboxImg, setLightboxImg] = useState(null);

  const filtered = activeCategory === 'All' ? images : images.filter(i => i.category === activeCategory);
  const visible = filtered.slice(0, count);
  const hasMore = count < filtered.length;

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setCount(INITIAL_COUNT);
  }, []);

  const breakpoints = { default: 3, 1100: 3, 768: 2, 500: 2 };

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian pt-28 pb-20">
        {/* Header */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto mb-12">
          <motion.span
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-mono text-xs text-gold tracking-widest uppercase block mb-3"
          >
            The Work
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-5xl md:text-7xl text-white font-light mb-10"
          >
            Photos
          </motion.h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
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
        </div>

        {/* Grid */}
        <div className="px-4 md:px-10 max-w-7xl mx-auto">
          <AnimatePresence>
            <Masonry
              breakpointCols={breakpoints}
              className="masonry-grid"
              columnClassName="masonry-grid-col"
            >
              {visible.map(img => (
                <GalleryItem key={img.id} image={img} onClick={setLightboxImg} />
              ))}
            </Masonry>
          </AnimatePresence>

          {hasMore && (
            <div className="text-center mt-14">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCount(c => c + LOAD_MORE_COUNT)}
                className="btn-gold glass-gold border border-gold/30 px-10 py-4 font-sans text-xs text-gold uppercase tracking-[0.25em] transition-all duration-400"
              >
                Load More Works
              </motion.button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-24 text-white/30 font-display text-2xl italic">
              No photos uploaded yet.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImg && <Lightbox image={lightboxImg} onClose={() => setLightboxImg(null)} />}
      </AnimatePresence>
    </PageTransition>
  );
}
