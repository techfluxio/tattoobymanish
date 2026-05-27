import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const DataContext = createContext(null);

const DEFAULT_CONFIG = {
  homepage: {
    heroVideoUrl: '/hero-bg.mp4',
    tagline: 'Art That Lives On Skin',
    subtagline: 'Premium Tattoo Artistry · Ranchi, India',
  },
  about: {
    name: 'Manish Kumar',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
    bio: 'With over a decade of mastery in the art of tattooing, I bring visions to life on skin.',
    specialties: ['Blackwork', 'Fine Line', 'Realism', 'Neo-Traditional', 'Mandala', 'Custom Design'],
    experience: '10+ Years',
    location: 'Ranchi, Jharkhand',
    instagram: 'https://instagram.com/tattoobymanish',
    whatsapp: '+91 98765 43210',
    email: 'ink@tattoobymanish.com',
  },
  contact: {
    instagram: '@tattoobymanish',
    instagramUrl: 'https://instagram.com/tattoobymanish',
    whatsapp: '+91 98765 43210',
    email: 'ink@tattoobymanish.com',
    socials: [
      { platform: 'Instagram', handle: '@tattoobymanish', url: 'https://instagram.com/tattoobymanish' },
      { platform: 'WhatsApp',  handle: '+91 98765 43210', url: 'https://wa.me/919876543210' },
      { platform: 'YouTube',   handle: 'TattooByManish',  url: 'https://youtube.com/@tattoobymanish' },
    ],
  },
};

export function DataProvider({ children }) {
  const [images,     setImages]     = useState([]);
  const [videos,     setVideos]     = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [about,      setAbout]      = useState(DEFAULT_CONFIG.about);
  const [contact,    setContact]    = useState(DEFAULT_CONFIG.contact);
  const [homepage,   setHomepage]   = useState(DEFAULT_CONFIG.homepage);
  const [loadingData, setLoadingData] = useState(true);

  // ── Bootstrap: load all public data once ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [imgRes, vidRes, catRes, cfgRes] = await Promise.all([
          api.get('/images?limit=50'),
          api.get('/videos?limit=20'),
          api.get('/categories'),
          api.get('/config'),
        ]);

        setImages(imgRes.data.images.map(normaliseImage));
        setVideos(vidRes.data.videos.map(normaliseVideo));

        const cats = catRes.data.categories.map(c => c.name);
        setCategories(['All', ...cats]);

        const cfg = cfgRes.data.config;
        if (cfg?.homepage) setHomepage(normaliseHomepage(cfg.homepage));
        if (cfg?.about)    setAbout(normaliseAbout(cfg.about));
        if (cfg?.contact)  setContact(normaliseContact(cfg.contact));
      } catch {
        // Silently fall back to defaults — site still works offline/during dev
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, []);

  // ── Normalise helpers (map DB shape → component shape) ────────────────────
  const normaliseImage = (i) => ({
    id:       i._id,
    src:      i.url,
    title:    i.title,
    category: i.category,
    publicId: i.publicId,
  });

  const normaliseVideo = (v) => ({
    id:        v._id,
    src:       v.url,
    thumbnail: v.thumbnailUrl,
    title:     v.title,
    category:  v.category,
    duration:  v.duration,
    publicId:  v.publicId,
  });

  const normaliseHomepage = (h) => ({
    heroVideo: h.heroVideoUrl || '/hero-bg.mp4',
    tagline:   h.tagline   || DEFAULT_CONFIG.homepage.tagline,
    subtagline: h.subtagline || DEFAULT_CONFIG.homepage.subtagline,
  });

  const normaliseAbout = (a) => ({
    name:        a.name        || DEFAULT_CONFIG.about.name,
    photo:       a.photoUrl    || DEFAULT_CONFIG.about.photo,
    bio:         a.bio         || DEFAULT_CONFIG.about.bio,
    specialties: a.specialties?.length ? a.specialties : DEFAULT_CONFIG.about.specialties,
    experience:  a.experience  || DEFAULT_CONFIG.about.experience,
    location:    a.location    || DEFAULT_CONFIG.about.location,
    instagram:   a.instagram   || DEFAULT_CONFIG.about.instagram,
    whatsapp:    a.whatsapp    || DEFAULT_CONFIG.about.whatsapp,
    email:       a.email       || DEFAULT_CONFIG.about.email,
  });

  const normaliseContact = (c) => ({
    instagram:    c.instagram    || DEFAULT_CONFIG.contact.instagram,
    instagramUrl: c.instagramUrl || DEFAULT_CONFIG.contact.instagramUrl,
    whatsapp:     c.whatsapp     || DEFAULT_CONFIG.contact.whatsapp,
    email:        c.email        || DEFAULT_CONFIG.contact.email,
    socials:      c.socials?.length ? c.socials : DEFAULT_CONFIG.contact.socials,
  });

  // ── Image actions ─────────────────────────────────────────────────────────
  const addImage = useCallback((img) => {
    setImages(prev => [normaliseImage(img), ...prev]);
  }, []);

  const deleteImage = useCallback(async (id) => {
    await api.delete(`/images/${id}`);
    setImages(prev => prev.filter(i => i.id !== id));
  }, []);

  // ── Video actions ─────────────────────────────────────────────────────────
  const addVideo = useCallback((vid) => {
    setVideos(prev => [normaliseVideo(vid), ...prev]);
  }, []);

  const deleteVideo = useCallback(async (id) => {
    await api.delete(`/videos/${id}`);
    setVideos(prev => prev.filter(v => v.id !== id));
  }, []);

  // ── Category actions ──────────────────────────────────────────────────────
  const refreshCategories = useCallback(async () => {
    const { data } = await api.get('/categories');
    setCategories(['All', ...data.categories.map(c => c.name)]);
  }, []);

  // ── Config setters ────────────────────────────────────────────────────────
  const updateAbout   = useCallback((a) => setAbout(normaliseAbout(a)), []);
  const updateContact = useCallback((c) => setContact(normaliseContact(c)), []);
  const updateHomepage = useCallback((h) => setHomepage(normaliseHomepage(h)), []);

  return (
    <DataContext.Provider value={{
      images,        addImage,    deleteImage,
      videos,        addVideo,    deleteVideo,
      categories,    refreshCategories,
      about,         setAbout:    updateAbout,
      contact,       setContact:  updateContact,
      homepage,      setHomepage: updateHomepage,
      loadingData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);