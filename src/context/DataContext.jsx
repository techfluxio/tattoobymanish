import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext(null);

/* ─── Default / seed data ─── */
const DEMO_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600', category: 'Blackwork', title: 'Sacred Geometry' },
  { id: 2, src: 'https://images.unsplash.com/photo-1590246814883-57c511e88785?w=600', category: 'Realism',   title: 'Portrait Study' },
  { id: 3, src: 'https://images.unsplash.com/photo-1612459284270-b9b5bdcba0de?w=600', category: 'Minimal',   title: 'Fine Line' },
  { id: 4, src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600', category: 'Sleeve',    title: 'Dragon Sleeve' },
  { id: 5, src: 'https://images.unsplash.com/photo-1589561253898-768105ca91a8?w=600', category: 'Blackwork', title: 'Mandala Art' },
  { id: 6, src: 'https://images.unsplash.com/photo-1546961342-ea5f62d6d618?w=600', category: 'Custom',    title: 'Custom Piece' },
  { id: 7, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', category: 'Realism',   title: 'Wildlife' },
  { id: 8, src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', category: 'Minimal',   title: 'Botanical' },
  { id: 9, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600', category: 'Sleeve',    title: 'Japanese Style' },
  { id: 10, src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600', category: 'Blackwork', title: 'Dotwork' },
  { id: 11, src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600', category: 'Custom',    title: 'Neo-trad' },
  { id: 12, src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600', category: 'Realism',   title: 'Floral Realism' },
];

const DEMO_VIDEOS = [
  { id: 1, src: 'https://www.w3schools.com/html/mov_bbb.mp4',  thumbnail: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=600', title: 'Sacred Geometry Process',   duration: '2:34', category: 'Blackwork' },
  { id: 2, src: 'https://www.w3schools.com/html/movie.mp4',    thumbnail: 'https://images.unsplash.com/photo-1590246814883-57c511e88785?w=600', title: 'Portrait Realism Timelapse',duration: '3:15', category: 'Realism'   },
  { id: 3, src: 'https://www.w3schools.com/html/mov_bbb.mp4',  thumbnail: 'https://images.unsplash.com/photo-1612459284270-b9b5bdcba0de?w=600', title: 'Minimal Fine Line Work',    duration: '1:48', category: 'Minimal'   },
  { id: 4, src: 'https://www.w3schools.com/html/movie.mp4',    thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600', title: 'Full Sleeve Session',       duration: '4:20', category: 'Sleeve'    },
  { id: 5, src: 'https://www.w3schools.com/html/mov_bbb.mp4',  thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', title: 'Wildlife Portrait',         duration: '2:55', category: 'Realism'   },
  { id: 6, src: 'https://www.w3schools.com/html/movie.mp4',    thumbnail: 'https://images.unsplash.com/photo-1546961342-ea5f62d6d618?w=600', title: 'Custom Commission',         duration: '3:40', category: 'Custom'    },
];

const DEMO_CATEGORIES = ['All', 'Blackwork', 'Realism', 'Minimal', 'Sleeve', 'Custom'];

const DEMO_ABOUT = {
  name: 'Manish Kumar',
  photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
  bio: 'With over a decade of mastery in the art of tattooing, I bring visions to life on skin. My work spans the full spectrum — from razor-sharp blackwork and photorealistic portraits to delicate fine-line botanicals and bold neo-traditional pieces. Every tattoo I create is a unique collaboration between artist and client, a permanent story etched in ink.',
  specialties: ['Blackwork', 'Fine Line', 'Realism', 'Neo-Traditional', 'Mandala', 'Custom Design'],
  experience: '10+ Years',
  location: 'Ranchi, Jharkhand',
  instagram: 'https://instagram.com/tattoobymanish',
  whatsapp: '+91 98765 43210',
  email: 'ink@tattoobymanish.com',
};

const DEMO_CONTACT = {
  instagram: '@tattoobymanish',
  instagramUrl: 'https://instagram.com/tattoobymanish',
  whatsapp: '+91 98765 43210',
  email: 'ink@tattoobymanish.com',
  location: 'Ranchi, Jharkhand, India',
  socials: [
    { platform: 'Instagram', handle: '@tattoobymanish', url: 'https://instagram.com/tattoobymanish' },
    { platform: 'WhatsApp',  handle: '+91 98765 43210',  url: 'https://wa.me/919876543210'           },
    { platform: 'YouTube',   handle: 'TattooByManish',   url: 'https://youtube.com/@tattoobymanish'  },
  ],
};

const DEMO_HOMEPAGE = {
  heroVideo:  '/hero-bg.mp4',
  tagline:    'Art That Lives On Skin',
  subtagline: 'Premium Tattoo Artistry · Ranchi, India',
};

/* ─── localStorage helpers ─── */
const LS = {
  get: (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
};

/* ─── Provider ─── */
export function DataProvider({ children }) {
  // Initialise from localStorage first, fall back to demo data
  const [images,     setImagesRaw]     = useState(() => LS.get('tbm_images',     DEMO_IMAGES));
  const [videos,     setVideosRaw]     = useState(() => LS.get('tbm_videos',     DEMO_VIDEOS));
  const [categories, setCategoriesRaw] = useState(() => LS.get('tbm_categories', DEMO_CATEGORIES));
  const [about,      setAboutRaw]      = useState(() => LS.get('tbm_about',      DEMO_ABOUT));
  const [contact,    setContactRaw]    = useState(() => LS.get('tbm_contact',    DEMO_CONTACT));
  const [homepage,   setHomepageRaw]   = useState(() => LS.get('tbm_homepage',   DEMO_HOMEPAGE));
  const [nextId,     setNextId]        = useState(() => LS.get('tbm_nextId',     200));

  /* ─── Persist every state slice whenever it changes ─── */
  useEffect(() => { LS.set('tbm_images',     images);     }, [images]);
  useEffect(() => { LS.set('tbm_videos',     videos);     }, [videos]);
  useEffect(() => { LS.set('tbm_categories', categories); }, [categories]);
  useEffect(() => { LS.set('tbm_about',      about);      }, [about]);
  useEffect(() => { LS.set('tbm_contact',    contact);    }, [contact]);
  useEffect(() => { LS.set('tbm_homepage',   homepage);   }, [homepage]);
  useEffect(() => { LS.set('tbm_nextId',     nextId);     }, [nextId]);

  /* ─── Wrapped setters that also sync LS ─── */
  const setImages     = useCallback((val) => setImagesRaw(val),     []);
  const setVideos     = useCallback((val) => setVideosRaw(val),     []);
  const setCategories = useCallback((val) => setCategoriesRaw(val), []);
  const setAbout      = useCallback((val) => setAboutRaw(val),      []);
  const setContact    = useCallback((val) => setContactRaw(val),    []);
  const setHomepage   = useCallback((val) => setHomepageRaw(val),   []);

  /* ─── Image actions ─── */
  const addImage = useCallback((img) => {
    setNextId(n => {
      const id = n + 1;
      setImagesRaw(prev => [{ ...img, id }, ...prev]);
      return id;
    });
  }, []);

  const deleteImage = useCallback((id) => {
    setImagesRaw(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateImage = useCallback((id, patch) => {
    setImagesRaw(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }, []);

  /* ─── Video actions ─── */
  const addVideo = useCallback((vid) => {
    setNextId(n => {
      const id = n + 1;
      setVideosRaw(prev => [{ ...vid, id }, ...prev]);
      return id;
    });
  }, []);

  const deleteVideo = useCallback((id) => {
    setVideosRaw(prev => prev.filter(v => v.id !== id));
  }, []);

  const updateVideo = useCallback((id, patch) => {
    setVideosRaw(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));
  }, []);

  /* ─── Category actions ─── */
  const addCategory = useCallback((cat) => {
    setCategoriesRaw(prev => prev.includes(cat) ? prev : [...prev, cat]);
  }, []);

  const deleteCategory = useCallback((cat) => {
    if (cat === 'All') return;
    setCategoriesRaw(prev => prev.filter(c => c !== cat));
  }, []);

  const editCategory = useCallback((oldCat, newCat) => {
    if (!newCat || oldCat === 'All') return;
    setCategoriesRaw(prev => prev.map(c => c === oldCat ? newCat : c));
    // Also rename on all images that used the old category
    setImagesRaw(prev => prev.map(i => i.category === oldCat ? { ...i, category: newCat } : i));
    setVideosRaw(prev => prev.map(v => v.category === oldCat ? { ...v, category: newCat } : v));
  }, []);

  /* ─── Dev helper: reset everything to demo data ─── */
  const resetToDemo = useCallback(() => {
    setImagesRaw(DEMO_IMAGES);
    setVideosRaw(DEMO_VIDEOS);
    setCategoriesRaw(DEMO_CATEGORIES);
    setAboutRaw(DEMO_ABOUT);
    setContactRaw(DEMO_CONTACT);
    setHomepageRaw(DEMO_HOMEPAGE);
    setNextId(200);
    ['tbm_images','tbm_videos','tbm_categories','tbm_about','tbm_contact','tbm_homepage','tbm_nextId']
      .forEach(k => localStorage.removeItem(k));
  }, []);

  return (
    <DataContext.Provider value={{
      /* state */
      images, videos, categories, about, contact, homepage,
      /* image actions */
      addImage, deleteImage, updateImage, setImages,
      /* video actions */
      addVideo, deleteVideo, updateVideo, setVideos,
      /* category actions */
      addCategory, deleteCategory, editCategory,
      /* single-object setters */
      setAbout, setContact, setHomepage,
      /* dev */
      resetToDemo,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};
