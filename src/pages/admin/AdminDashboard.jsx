import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import api from '../../utils/api';

// ─────────────────────────────────────────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'overview',   label: 'Overview',   icon: '◈', path: '/admin/dashboard' },
  { id: 'gallery',    label: 'Gallery',    icon: '⬡', path: '/admin/gallery' },
  { id: 'videos',     label: 'Videos',     icon: '▷', path: '/admin/videos' },
  { id: 'categories', label: 'Categories', icon: '⊞', path: '/admin/categories' },
  { id: 'about',      label: 'About Me',   icon: '◉', path: '/admin/about' },
  { id: 'contact',    label: 'Contact',    icon: '◎', path: '/admin/contact' },
  { id: 'homepage',   label: 'Homepage',   icon: '⌂', path: '/admin/homepage' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UPLOAD PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ pct }) {
  if (!pct || pct <= 0 || pct >= 100) return null;
  return (
    <div className="w-full h-0.5 bg-white/10 mt-3 overflow-hidden">
      <motion.div
        className="h-full bg-gold"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
function OverviewPanel({ images, videos, categories }) {
  const stats = [
    { label: 'Total Images',  value: images.length },
    { label: 'Total Videos',  value: videos.length },
    { label: 'Categories',    value: categories.length },
    { label: 'Status',        value: 'Live' },
  ];
  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="glass border border-white/5 p-4 md:p-5">
            <p className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-2 leading-tight">{s.label}</p>
            <p className="font-display text-2xl md:text-3xl text-gold font-light">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="glass border border-gold/10 p-5">
        <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-2">Backend Connected</p>
        <p className="font-sans text-sm text-white/40 leading-relaxed">
          All data persists in MongoDB Atlas. Images and videos are stored in Cloudinary.
        </p>
        <p className="font-mono text-xs text-white/15 mt-3">
          Session auto-expires after 5 minutes of inactivity.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function GalleryPanel({ images, addImage, deleteImage, categories }) {
  const [file,     setFile]     = useState(null);
  const [title,    setTitle]    = useState('');
  const [category, setCategory] = useState('Blackwork');
  const [msg,      setMsg]      = useState({ text: '', type: 'gold' });
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const flash = (text, type = 'gold') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'gold' }), 3000);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) { flash('File and title required.', 'red'); return; }
    setLoading(true); setProgress(0);
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('title', title.trim());
      form.append('category', category);
      const { data } = await api.post('/images', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      addImage(data.image);
      setFile(null); setTitle(''); setProgress(0);
      flash('✓ Image uploaded successfully');
    } catch (err) {
      flash(err.response?.data?.message || 'Upload failed', 'red');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteImage(id); flash('✓ Image deleted'); }
    catch { flash('Delete failed', 'red'); }
    finally { setDeleting(null); }
  };

  const cats = categories.filter(c => c !== 'All');

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">Gallery Management</h2>

      {/* Upload form */}
      <div className="glass border border-white/5 p-5 mb-6">
        <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-4">Upload Image</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          <label className="flex items-center gap-2 bg-white/3 border border-white/10 hover:border-gold/30 px-4 py-3 cursor-pointer transition-colors sm:col-span-2 lg:col-span-1 min-w-0">
            <span className="font-sans text-sm text-white/40 truncate">{file ? file.name : 'Choose image…'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={e => setFile(e.target.files[0])} />
          </label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            maxLength={100}
            className="bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none"
          />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-charcoal border border-white/10 text-white/70 font-sans text-sm px-4 py-3 outline-none">
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleUpload} disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-6 py-2 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50 transition-all">
          {loading ? 'Uploading…' : 'Upload to Cloudinary'}
        </button>
        <ProgressBar pct={progress} />
        {msg.text && (
          <p className={`font-mono text-xs mt-2 ${msg.type === 'red' ? 'text-red-400/70' : 'text-gold'}`}>
            {msg.text}
          </p>
        )}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map(img => (
          <div key={img.id} className="relative group aspect-square overflow-hidden">
            <img src={img.src} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-2">
              <p className="font-sans text-xs text-white/80 text-center leading-tight line-clamp-2">{img.title}</p>
              <p className="font-mono text-[10px] text-gold/60">{img.category}</p>
              <button onClick={() => handleDelete(img.id)} disabled={deleting === img.id}
                className="font-mono text-xs text-red-400/70 hover:text-red-400 border border-red-400/20 px-3 py-1 transition-colors disabled:opacity-50 mt-1">
                {deleting === img.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full font-sans text-sm text-white/20 text-center py-10">No images yet. Upload one above.</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: VIDEOS
// ─────────────────────────────────────────────────────────────────────────────
function VideosPanel({ videos, addVideo, deleteVideo }) {
  const [file,     setFile]     = useState(null);
  const [title,    setTitle]    = useState('');
  const [msg,      setMsg]      = useState({ text: '', type: 'gold' });
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const flash = (text, type = 'gold') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'gold' }), 4000);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) { flash('File and title required.', 'red'); return; }
    setLoading(true); setProgress(0);
    try {
      const form = new FormData();
      form.append('video', file);
      form.append('title', title.trim());
      const { data } = await api.post('/videos', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100)),
        timeout: 5 * 60 * 1000,
      });
      addVideo(data.video);
      setFile(null); setTitle(''); setProgress(0);
      flash('✓ Video uploaded successfully');
    } catch (err) {
      flash(err.response?.data?.message || 'Upload failed', 'red');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteVideo(id); flash('✓ Video deleted'); }
    catch { flash('Delete failed', 'red'); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">Video Management</h2>
      <div className="glass border border-white/5 p-5 mb-6">
        <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-4">Upload Video</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <label className="flex items-center gap-2 bg-white/3 border border-white/10 hover:border-gold/30 px-4 py-3 cursor-pointer transition-colors min-w-0">
            <span className="font-sans text-sm text-white/40 truncate">{file ? file.name : 'Choose video (mp4/mov/webm)…'}</span>
            <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
              onChange={e => setFile(e.target.files[0])} />
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" maxLength={100}
            className="bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none" />
        </div>
        <button onClick={handleUpload} disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-6 py-2 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Uploading…' : 'Upload to Cloudinary'}
        </button>
        <ProgressBar pct={progress} />
        {loading && <p className="font-sans text-xs text-white/25 mt-2">Large videos may take a few minutes…</p>}
        {msg.text && (
          <p className={`font-mono text-xs mt-2 ${msg.type === 'red' ? 'text-red-400/70' : 'text-gold'}`}>{msg.text}</p>
        )}
      </div>
      <div className="space-y-3">
        {videos.map(v => (
          <div key={v.id} className="glass border border-white/5 flex items-center gap-4 p-4 min-w-0">
            {v.thumbnail && <img src={v.thumbnail} alt="" className="w-16 h-10 object-cover flex-shrink-0 hidden sm:block" />}
            <div className="flex-1 min-w-0">
              <p className="font-display text-white text-sm truncate">{v.title}</p>
              <p className="font-mono text-xs text-white/25 truncate hidden md:block">{v.src}</p>
            </div>
            <button onClick={() => handleDelete(v.id)} disabled={deleting === v.id}
              className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-red-400/15 px-3 py-1 flex-shrink-0 transition-colors disabled:opacity-50">
              {deleting === v.id ? '…' : 'Delete'}
            </button>
          </div>
        ))}
        {videos.length === 0 && (
          <p className="font-sans text-sm text-white/20 text-center py-10">No videos yet. Upload one above.</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
function CategoriesPanel({ refreshCategories }) {
  const [cats,    setCats]    = useState([]);
  const [newCat,  setNewCat]  = useState('');
  const [editMap, setEditMap] = useState({});
  const [msg,     setMsg]     = useState({ text: '', type: 'gold' });
  const [busy,    setBusy]    = useState('');

  const flash = (text, type = 'gold') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'gold' }), 2500);
  };

  const load = useCallback(async () => {
    const { data } = await api.get('/categories');
    setCats(data.categories);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newCat.trim()) return;
    setBusy('add');
    try {
      await api.post('/categories', { name: newCat.trim() });
      setNewCat('');
      await load(); await refreshCategories();
      flash('✓ Category added');
    } catch (err) { flash(err.response?.data?.message || 'Error', 'red'); }
    finally { setBusy(''); }
  };

  const handleEdit = async (id) => {
    const name = editMap[id]?.trim();
    if (!name) return;
    setBusy(id);
    try {
      await api.put(`/categories/${id}`, { name });
      setEditMap(m => { const n = { ...m }; delete n[id]; return n; });
      await load(); await refreshCategories(); flash('✓ Updated');
    } catch (err) { flash(err.response?.data?.message || 'Error', 'red'); }
    finally { setBusy(''); }
  };

  const handleDelete = async (id) => {
    setBusy(id + '_del');
    try {
      await api.delete(`/categories/${id}`);
      await load(); await refreshCategories(); flash('✓ Deleted');
    } catch (err) { flash(err.response?.data?.message || 'Error', 'red'); }
    finally { setBusy(''); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">Categories</h2>
      <div className="glass border border-white/5 p-5 mb-6">
        <div className="flex gap-3">
          <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" maxLength={50}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none min-w-0" />
          <button onClick={handleAdd} disabled={busy === 'add'}
            className="btn-gold glass-gold border border-gold/30 px-5 py-2 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50 flex-shrink-0">
            {busy === 'add' ? '…' : 'Add'}
          </button>
        </div>
        {msg.text && (
          <p className={`font-mono text-xs mt-2 ${msg.type === 'red' ? 'text-red-400/70' : 'text-gold'}`}>{msg.text}</p>
        )}
      </div>
      <div className="space-y-2">
        {cats.map(cat => (
          <div key={cat._id} className="glass border border-white/5 flex flex-wrap sm:flex-nowrap items-center gap-2 px-4 py-3 min-w-0">
            <span className="font-display text-white flex-1 min-w-0 truncate">{cat.name}</span>
            <input
              value={editMap[cat._id] ?? ''}
              onChange={e => setEditMap(m => ({ ...m, [cat._id]: e.target.value }))}
              placeholder="Rename…" maxLength={50}
              onKeyDown={e => e.key === 'Enter' && handleEdit(cat._id)}
              className="w-28 bg-white/3 border border-white/10 focus:border-gold/50 text-white text-xs px-3 py-2 outline-none flex-shrink-0"
            />
            <button onClick={() => handleEdit(cat._id)} disabled={busy === cat._id}
              className="font-mono text-xs text-gold/60 hover:text-gold border border-gold/15 px-3 py-1 transition-colors disabled:opacity-50 flex-shrink-0">
              Save
            </button>
            <button onClick={() => handleDelete(cat._id)} disabled={busy === cat._id + '_del'}
              className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-red-400/15 px-3 py-1 transition-colors disabled:opacity-50 flex-shrink-0">
              {busy === cat._id + '_del' ? '…' : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: ABOUT
// ─────────────────────────────────────────────────────────────────────────────
function AboutPanel({ about, setAbout }) {
  const [form,     setForm]     = useState({ ...about, specialties: (about.specialties || []).join(', ') });
  const [file,     setFile]     = useState(null);
  const [msg,      setMsg]      = useState({ text: '', type: 'gold' });
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);

  const flash = (text, type = 'gold') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'gold' }), 3000);
  };

  const save = async () => {
    setLoading(true); setProgress(0);
    try {
      const fd = new FormData();
      ['name','bio','experience','location','instagram','whatsapp','email'].forEach(f => fd.append(f, form[f] || ''));
      fd.append('specialties', JSON.stringify(
        form.specialties.split(',').map(s => s.trim()).filter(Boolean)
      ));
      if (file) fd.append('photo', file);
      const { data } = await api.put('/config/about', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      setAbout(data.about);
      setFile(null); setProgress(0);
      flash('✓ Saved successfully');
    } catch (err) { flash(err.response?.data?.message || 'Save failed', 'red'); }
    finally { setLoading(false); }
  };

  const fields = [
    ['Artist Name', 'name', 60],
    ['Location', 'location', 100],
    ['Experience', 'experience', 20],
    ['Instagram URL', 'instagram', 200],
    ['WhatsApp Number', 'whatsapp', 20],
    ['Email', 'email', 100],
  ];

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">About Page</h2>
      <div className="glass border border-white/5 p-5 space-y-4">
        {fields.map(([label, key, max]) => (
          <div key={key}>
            <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} maxLength={max}
              className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none" />
          </div>
        ))}
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Bio</label>
          <textarea value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={4} maxLength={1000}
            className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none resize-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Specialties (comma separated)</label>
          <input value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} maxLength={300}
            className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Artist Photo</label>
          <label className="inline-flex items-center gap-2 bg-white/3 border border-white/10 hover:border-gold/30 px-4 py-3 cursor-pointer transition-colors max-w-full">
            <span className="font-sans text-sm text-white/40 truncate max-w-xs">{file ? file.name : 'Replace photo…'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <div>
          <button onClick={save} disabled={loading}
            className="btn-gold glass-gold border border-gold/30 px-8 py-3 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <ProgressBar pct={progress} />
          {msg.text && (
            <p className={`font-mono text-xs mt-2 ${msg.type === 'red' ? 'text-red-400/70' : 'text-gold'}`}>{msg.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: CONTACT
// ─────────────────────────────────────────────────────────────────────────────
function ContactPanel({ contact, setContact }) {
  const [form, setForm]   = useState({ ...contact });
  const [msg,  setMsg]    = useState({ text: '', type: 'gold' });
  const [loading, setLoading] = useState(false);

  const flash = (text, type = 'gold') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'gold' }), 3000);
  };

  const save = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/config/contact', {
        instagram:    form.instagram,
        instagramUrl: form.instagramUrl,
        whatsapp:     form.whatsapp,
        email:        form.email,
        socials:      JSON.stringify(form.socials),
      });
      setContact(data.contact);
      flash('✓ Saved successfully');
    } catch (err) { flash(err.response?.data?.message || 'Save failed', 'red'); }
    finally { setLoading(false); }
  };

  const fields = [
    ['Instagram Handle', 'instagram', 50],
    ['Instagram URL', 'instagramUrl', 200],
    ['WhatsApp Number', 'whatsapp', 20],
    ['Email', 'email', 100],
  ];

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">Contact Page</h2>
      <div className="glass border border-white/5 p-5 space-y-4">
        {fields.map(([label, key, max]) => (
          <div key={key}>
            <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} maxLength={max}
              className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none" />
          </div>
        ))}
        <div>
          <button onClick={save} disabled={loading}
            className="btn-gold glass-gold border border-gold/30 px-8 py-3 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          {msg.text && (
            <p className={`font-mono text-xs mt-2 ${msg.type === 'red' ? 'text-red-400/70' : 'text-gold'}`}>{msg.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: HOMEPAGE
// ─────────────────────────────────────────────────────────────────────────────
function HomepagePanel({ homepage, setHomepage }) {
  const [form,    setForm]    = useState({ tagline: homepage.tagline, subtagline: homepage.subtagline });
  const [file,    setFile]    = useState(null);
  const [msg,     setMsg]     = useState({ text: '', type: 'gold' });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const flash = (text, type = 'gold') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: 'gold' }), 3000);
  };

  const save = async () => {
    setLoading(true); setProgress(0);
    try {
      const fd = new FormData();
      fd.append('tagline',    form.tagline || '');
      fd.append('subtagline', form.subtagline || '');
      if (file) fd.append('heroVideo', file);
      const { data } = await api.put('/config/homepage', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100)),
        timeout: 5 * 60 * 1000,
      });
      setHomepage(data.homepage);
      setFile(null); setProgress(0);
      flash('✓ Saved successfully');
    } catch (err) { flash(err.response?.data?.message || 'Save failed', 'red'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl text-white font-light mb-6">Homepage Settings</h2>
      <div className="glass border border-white/5 p-5 space-y-4">
        {[['Tagline', 'tagline', 100], ['Sub-tagline', 'subtagline', 100]].map(([label, key, max]) => (
          <div key={key}>
            <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} maxLength={max}
              className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none" />
          </div>
        ))}
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Hero Video (replace)</label>
          <label className="inline-flex items-center gap-2 bg-white/3 border border-white/10 hover:border-gold/30 px-4 py-3 cursor-pointer transition-colors max-w-full">
            <span className="font-sans text-sm text-white/40 truncate max-w-xs">{file ? file.name : 'Choose new hero video…'}</span>
            <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
              onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <div>
          <button onClick={save} disabled={loading}
            className="btn-gold glass-gold border border-gold/30 px-8 py-3 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <ProgressBar pct={progress} />
          {msg.text && (
            <p className={`font-mono text-xs mt-2 ${msg.type === 'red' ? 'text-red-400/70' : 'text-gold'}`}>{msg.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose, onLogout }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside className={`
        admin-sidebar fixed lg:relative top-0 left-0 h-full z-40
        w-52 flex-shrink-0 flex flex-col
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/5 flex-shrink-0">
          <p className="font-display text-base text-white leading-tight">TBM Admin</p>
          <p className="font-mono text-[10px] text-gold/40 mt-0.5 tracking-widest">v2.0 · Backend</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(item => {
            const active = location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-5 py-3 font-sans text-xs tracking-wider uppercase
                  transition-all duration-200 w-full
                  ${active
                    ? 'text-gold border-r-2 border-gold bg-gold/5'
                    : 'text-white/30 hover:text-white/70 hover:bg-white/3'
                  }
                `}
              >
                <span className="text-sm flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-4 py-4 border-t border-white/5 space-y-1 flex-shrink-0">
          <Link to="/" onClick={onClose}
            className="block w-full text-center font-mono text-[10px] text-white/20 hover:text-white/50 tracking-widest uppercase transition-colors py-1.5">
            ← View Site
          </Link>
          <button onClick={onLogout}
            className="block w-full font-mono text-[10px] text-red-400/30 hover:text-red-400/70 tracking-widest uppercase transition-colors py-1.5">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
function Topbar({ onMenuToggle, onLogout }) {
  const location = useLocation();
  const current  = NAV.find(n => location.pathname === n.path ||
    (n.path !== '/admin/dashboard' && location.pathname.startsWith(n.path)));

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-white/5">
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex flex-col gap-[5px] w-7 flex-shrink-0 mr-1"
          aria-label="Toggle menu"
        >
          <span className="block h-px w-7 bg-white/50" />
          <span className="block h-px w-5 bg-gold/70" />
          <span className="block h-px w-7 bg-white/50" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs text-white/20 tracking-widest uppercase hidden sm:block">Admin</span>
          <span className="text-white/10 hidden sm:block">/</span>
          <span className="font-mono text-xs text-gold tracking-widest uppercase truncate">
            {current?.label || 'Dashboard'}
          </span>
        </div>
      </div>
      <button onClick={onLogout}
        className="font-mono text-xs text-white/25 hover:text-red-400/60 tracking-widest uppercase transition-colors flex-shrink-0 ml-4">
        Logout
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const {
    images, addImage, deleteImage,
    videos, addVideo, deleteVideo,
    categories, refreshCategories,
    about, setAbout,
    contact, setContact,
    homepage, setHomepage,
  } = useData();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout('manual');
    navigate('/admin/login', { replace: true });
  }, [logout, navigate]);

  const closeMenu = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-obsidian flex text-white overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={closeMenu} onLogout={handleLogout} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Topbar onMenuToggle={() => setSidebarOpen(o => !o)} onLogout={handleLogout} />

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="dashboard"  element={<Panel><OverviewPanel images={images} videos={videos} categories={categories} /></Panel>} />
              <Route path="gallery"    element={<Panel><GalleryPanel images={images} addImage={addImage} deleteImage={deleteImage} categories={categories} /></Panel>} />
              <Route path="videos"     element={<Panel><VideosPanel videos={videos} addVideo={addVideo} deleteVideo={deleteVideo} /></Panel>} />
              <Route path="categories" element={<Panel><CategoriesPanel refreshCategories={refreshCategories} /></Panel>} />
              <Route path="about"      element={<Panel><AboutPanel about={about} setAbout={setAbout} /></Panel>} />
              <Route path="contact"    element={<Panel><ContactPanel contact={contact} setContact={setContact} /></Panel>} />
              <Route path="homepage"   element={<Panel><HomepagePanel homepage={homepage} setHomepage={setHomepage} /></Panel>} />
              <Route path="*"          element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Route transition wrapper
function Panel({ children }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}