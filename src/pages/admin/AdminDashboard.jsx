import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const NAV = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'gallery', label: 'Gallery', icon: '⬡' },
  { id: 'videos', label: 'Videos', icon: '▷' },
  { id: 'categories', label: 'Categories', icon: '⊞' },
  { id: 'about', label: 'About Me', icon: '◉' },
  { id: 'contact', label: 'Contact', icon: '◎' },
  { id: 'homepage', label: 'Homepage', icon: '⌂' },
];

// ── Shared upload progress bar ─────────────────────────────────────────────
function ProgressBar({ pct }) {
  if (pct === 0 || pct === 100) return null;
  return (
    <div className="w-full h-1 bg-white/10 mt-3">
      <div className="h-full bg-gold transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewPanel({ images, videos, categories }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Images', value: images.length },
          { label: 'Total Videos', value: videos.length },
          { label: 'Categories', value: categories.length },
          { label: 'Status', value: 'Live' },
        ].map(s => (
          <div key={s.label} className="glass border border-white/5 p-5">
            <p className="font-mono text-xs text-white/25 tracking-widest uppercase mb-2">{s.label}</p>
            <p className="font-display text-3xl text-gold font-light">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="glass border border-gold/10 p-5">
        <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-2">Backend Connected</p>
        <p className="font-sans text-sm text-white/40">All data persists in MongoDB Atlas. Images and videos are stored in Cloudinary.</p>
      </div>
    </div>
  );
}

// ── Gallery ───────────────────────────────────────────────────────────────────
function GalleryPanel({ images, addImage, deleteImage, categories }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const handleUpload = async () => {
    if (!file || !title || !category) { setMsg('File, title, and category required.'); return; }
    setLoading(true); setMsg(''); setProgress(0);
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('title', title);
      form.append('category', category);
      const { data } = await api.post('/images', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      addImage(data.image);
      setFile(null); setTitle(''); setCategory(''); setProgress(0);
      setMsg('✓ Image uploaded');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try { await deleteImage(id); }
    catch { /* deleteImage throws — already handled in DataContext */ }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">Gallery Management</h2>
      <div className="glass border border-white/5 p-6 mb-8">
        <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-4">Upload Image</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <label className="flex items-center gap-3 bg-white/3 border border-white/10 px-4 py-3 cursor-pointer hover:border-gold/30 transition-colors col-span-full md:col-span-1">
            <span className="font-sans text-sm text-white/40 truncate">{file ? file.name : 'Choose image file…'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" maxLength={100}
            className="bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-charcoal border border-white/10 text-white/70 font-sans text-sm px-4 py-3 outline-none"
          >
            <option value="">Select Category</option>

            {categories
              .filter(c => c !== 'All')
              .map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>
        <button onClick={handleUpload} disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-6 py-2 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Uploading…' : 'Upload to Cloudinary'}
        </button>
        <ProgressBar pct={progress} />
        {msg && <p className="font-mono text-xs text-gold mt-2">{msg}</p>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map(img => (
          <div key={img.id} className="relative group">
            <img src={img.src} alt={img.title} className="w-full aspect-square object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <p className="font-sans text-xs text-white/70 text-center">{img.title}</p>
              <p className="font-mono text-xs text-gold/60">{img.category}</p>
              <button
                onClick={() => handleDelete(img.id)}
                disabled={deleting === img.id}
                className="font-mono text-xs text-red-400/70 hover:text-red-400 border border-red-400/20 px-3 py-1 transition-colors disabled:opacity-50">
                {deleting === img.id ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Videos ────────────────────────────────────────────────────────────────────
function VideosPanel({ videos, addVideo, deleteVideo }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleting, setDeleting] = useState(null);

  const handleUpload = async () => {
    if (!file || !title) {
      setMsg('File and title required.');
      return;
    }

    setLoading(true);
    setMsg('');
    setProgress(0);

    try {
      const form = new FormData();

      form.append('video', file);
      form.append('title', title);

      const { data } = await api.post('/videos', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },

        onUploadProgress: (e) =>
          setProgress(
            Math.round((e.loaded / e.total) * 100)
          ),

        timeout: 5 * 60 * 1000,
      });

      addVideo(data.video);

      setFile(null);
      setTitle('');
      setProgress(0);

      setMsg('✓ Video uploaded');
    } catch (err) {
      setMsg(
        err.response?.data?.message || 'Upload failed'
      );
    } finally {
      setLoading(false);

      setTimeout(() => setMsg(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);

    try {
      await deleteVideo(id);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">
        Video Management
      </h2>

      {/* Upload Section */}
      <div className="glass border border-white/5 p-6 mb-8">
        <p className="font-mono text-xs text-gold/50 tracking-widest uppercase mb-4">
          Upload Video
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">

          {/* File Upload */}
          <label className="flex items-center gap-3 bg-white/3 border border-white/10 px-4 py-3 cursor-pointer hover:border-gold/30 transition-colors">
            <span className="font-sans text-sm text-white/40 truncate">
              {file
                ? file.name
                : 'Choose video file (mp4/mov/webm)…'}
            </span>

            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />
          </label>

          {/* Title */}
          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Video Title"
            maxLength={100}
            className="bg-white/3 border border-white/10 focus:border-gold/50 text-white font-sans text-sm px-4 py-3 outline-none"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-6 py-2 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50"
        >
          {loading
            ? 'Uploading…'
            : 'Upload to Cloudinary'}
        </button>

        <ProgressBar pct={progress} />

        {loading && (
          <p className="font-sans text-xs text-white/30 mt-2">
            Large videos may take a few minutes…
          </p>
        )}

        {msg && (
          <p className="font-mono text-xs text-gold mt-2">
            {msg}
          </p>
        )}
      </div>

      {/* Videos List */}
      <div className="space-y-3">

        {videos.length === 0 && (
          <div className="glass border border-white/5 p-8 text-center">
            <p className="font-display text-2xl text-white/30 italic">
              No videos uploaded yet.
            </p>
          </div>
        )}

        {videos.map((v) => (
          <div
            key={v.id}
            className="glass border border-white/5 flex items-center gap-4 p-4"
          >

            {v.thumbnail && (
              <img
                src={v.thumbnail}
                alt=""
                className="w-20 h-12 object-cover flex-shrink-0"
              />
            )}

            <div className="flex-1 min-w-0">
              <p className="font-display text-white">
                {v.title}
              </p>

              <p className="font-mono text-xs text-white/30 truncate">
                {v.src}
              </p>
            </div>

            <button
              onClick={() => handleDelete(v.id)}
              disabled={deleting === v.id}
              className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-red-400/15 px-3 py-1 flex-shrink-0 transition-colors disabled:opacity-50"
            >
              {deleting === v.id
                ? '…'
                : 'Delete'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Categories ────────────────────────────────────────────────────────────────
function CategoriesPanel({ refreshCategories }) {
  const [cats, setCats] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [editMap, setEditMap] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get('/categories');
    setCats(data.categories);
  };

  useState(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleAdd = async () => {
    if (!newCat.trim()) return;
    setLoading(true);
    try {
      await api.post('/categories', { name: newCat.trim() });
      setNewCat('');
      await load();
      await refreshCategories();
      flash('✓ Added');
    } catch (err) { flash(err.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  const handleEdit = async (id) => {
    const name = editMap[id]?.trim();
    if (!name) return;
    try {
      await api.put(`/categories/${id}`, { name });
      setEditMap(m => { const n = { ...m }; delete n[id]; return n; });
      await load(); await refreshCategories(); flash('✓ Updated');
    } catch (err) { flash(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      await load(); await refreshCategories(); flash('✓ Deleted');
    } catch (err) { flash(err.response?.data?.message || 'Error'); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">Categories</h2>
      <div className="glass border border-white/5 p-6 mb-6">
        <div className="flex gap-3">
          <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" maxLength={50}
            className="flex-1 bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none" />
          <button onClick={handleAdd} disabled={loading}
            className="btn-gold glass-gold border border-gold/30 px-6 py-2 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
            Add
          </button>
        </div>
        {msg && <p className="font-mono text-xs text-gold mt-2">{msg}</p>}
      </div>
      <div className="space-y-3">
        {cats.map(cat => (
          <div key={cat._id} className="glass border border-white/5 flex items-center gap-3 px-5 py-3">
            <span className="font-display text-white flex-1">{cat.name}</span>
            <input
              value={editMap[cat._id] ?? ''}
              onChange={e => setEditMap(m => ({ ...m, [cat._id]: e.target.value }))}
              placeholder="Rename…" maxLength={50}
              className="w-28 bg-white/3 border border-white/10 focus:border-gold/50 text-black text-xs px-3 py-2 outline-none"
            />
            <button onClick={() => handleEdit(cat._id)} className="font-mono text-xs text-gold/60 hover:text-gold border border-gold/15 px-3 py-1 transition-colors">Save</button>
            <button onClick={() => handleDelete(cat._id)} className="font-mono text-xs text-red-400/60 hover:text-red-400 border border-red-400/15 px-3 py-1 transition-colors">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutPanel({ about, setAbout }) {
  const [form, setForm] = useState({ ...about, specialties: (about.specialties || []).join(', ') });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const save = async () => {
    setLoading(true); setMsg(''); setProgress(0);
    try {
      const fd = new FormData();
      const fields = ['name', 'bio', 'experience', 'location', 'instagram', 'whatsapp', 'email'];
      fields.forEach(f => fd.append(f, form[f] || ''));
      fd.append('specialties', JSON.stringify(
        form.specialties.split(',').map(s => s.trim()).filter(Boolean)
      ));
      if (file) fd.append('photo', file);

      const { data } = await api.put('/config/about', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      setAbout(data.about);
      setFile(null); setProgress(0); setMsg('✓ Saved');
    } catch (err) { setMsg(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">About Page</h2>
      <div className="glass border border-white/5 p-6 space-y-4">
        {[
          ['Artist Name', 'name', 60], ['Location', 'location', 100],
          ['Experience', 'experience', 20], ['Instagram URL', 'instagram', 200],
          ['WhatsApp Number', 'whatsapp', 20], ['Email', 'email', 100],
        ].map(([label, key, max]) => (
          <div key={key}>
            <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} maxLength={max}
              className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none" />
          </div>
        ))}
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Bio</label>
          <textarea value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={5} maxLength={1000}
            className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none resize-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Specialties (comma separated)</label>
          <input value={form.specialties} onChange={e => setForm(f => ({ ...f, specialties: e.target.value }))} maxLength={300}
            className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Artist Photo</label>
          <label className="flex items-center gap-3 bg-white/3 border border-white/10 px-4 py-3 cursor-pointer hover:border-gold/30 w-fit">
            <span className="font-sans text-sm text-white/40">{file ? file.name : 'Replace photo…'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <button onClick={save} disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-8 py-3 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
        <ProgressBar pct={progress} />
        {msg && <p className="font-mono text-xs text-gold">{msg}</p>}
      </div>
    </div>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function ContactPanel({ contact, setContact }) {
  const [form, setForm] = useState({ ...contact });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        instagram: form.instagram,
        instagramUrl: form.instagramUrl,
        whatsapp: form.whatsapp,
        email: form.email,
        socials: JSON.stringify(form.socials),
      };
      const { data } = await api.put('/config/contact', payload);
      setContact(data.contact);
      setMsg('✓ Saved');
    } catch (err) { setMsg(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">Contact Page</h2>
      <div className="glass border border-white/5 p-6 space-y-4">
        {[
          ['Instagram Handle', 'instagram', 50], ['Instagram URL', 'instagramUrl', 200],
          ['WhatsApp Number', 'whatsapp', 20], ['Email', 'email', 100],
        ].map(([label, key, max]) => (
          <div key={key}>
            <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} maxLength={max}
              className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none" />
          </div>
        ))}
        <button onClick={save} disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-8 py-3 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
        {msg && <p className="font-mono text-xs text-gold">{msg}</p>}
      </div>
    </div>
  );
}

// ── Homepage ──────────────────────────────────────────────────────────────────
function HomepagePanel({ homepage, setHomepage }) {
  const [form, setForm] = useState({ tagline: homepage.tagline, subtagline: homepage.subtagline });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const save = async () => {
    setLoading(true); setMsg(''); setProgress(0);
    try {
      const fd = new FormData();
      fd.append('tagline', form.tagline || '');
      fd.append('subtagline', form.subtagline || '');
      if (file) fd.append('heroVideo', file);

      const { data } = await api.put('/config/homepage', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(Math.round((e.loaded / e.total) * 100)),
        timeout: 5 * 60 * 1000,
      });
      setHomepage(data.homepage);
      setFile(null); setProgress(0); setMsg('✓ Saved');
    } catch (err) { setMsg(err.response?.data?.message || 'Save failed'); }
    finally { setLoading(false); setTimeout(() => setMsg(''), 3000); }
  };

  return (
    <div>
      <h2 className="font-display text-3xl text-white font-light mb-8">Homepage Settings</h2>
      <div className="glass border border-white/5 p-6 space-y-4">
        {[['Tagline', 'tagline', 100], ['Sub-tagline', 'subtagline', 100]].map(([label, key, max]) => (
          <div key={key}>
            <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">{label}</label>
            <input value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} maxLength={max}
              className="w-full bg-white/3 border border-white/10 focus:border-gold/50 text-black font-sans text-sm px-4 py-3 outline-none" />
          </div>
        ))}
        <div>
          <label className="font-mono text-xs text-white/30 tracking-widest uppercase block mb-2">Hero Video (replace)</label>
          <label className="flex items-center gap-3 bg-white/3 border border-white/10 px-4 py-3 cursor-pointer hover:border-gold/30 w-fit">
            <span className="font-sans text-sm text-white/40">{file ? file.name : 'Choose new hero video…'}</span>
            <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <button onClick={save} disabled={loading}
          className="btn-gold glass-gold border border-gold/30 px-8 py-3 font-mono text-xs text-gold uppercase tracking-widest disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
        <ProgressBar pct={progress} />
        {msg && <p className="font-mono text-xs text-gold">{msg}</p>}
      </div>
    </div>
  );
}

// ── Dashboard shell ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { images, addImage, deleteImage, videos, addVideo, deleteVideo,
    categories, refreshCategories, about, setAbout,
    contact, setContact, homepage, setHomepage } = useData();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const renderPanel = () => {
    switch (activePage) {
      case 'overview': return <OverviewPanel images={images} videos={videos} categories={categories} />;
      case 'gallery': return <GalleryPanel images={images} addImage={addImage} deleteImage={deleteImage} categories={categories} />;
      case 'videos': return <VideosPanel videos={videos} addVideo={addVideo} deleteVideo={deleteVideo} />;
      case 'categories': return <CategoriesPanel refreshCategories={refreshCategories} />;
      case 'about': return <AboutPanel about={about} setAbout={setAbout} />;
      case 'contact': return <ContactPanel contact={contact} setContact={setContact} />;
      case 'homepage': return <HomepagePanel homepage={homepage} setHomepage={setHomepage} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex text-white">
      {/* Sidebar */}
      <aside className={`admin-sidebar fixed md:relative top-0 left-0 h-full z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} w-56 flex-shrink-0 flex flex-col`}>
        <div className="p-6 border-b border-white/5">
          <span className="font-display text-sm text-white">TBM Admin</span>
          <span className="font-mono text-xs text-gold/40 block mt-1">v2.0 — Backend</span>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-6 py-3 font-sans text-xs tracking-widest uppercase transition-all duration-200 text-left ${activePage === item.id ? 'text-gold border-r border-gold bg-gold/5' : 'text-white/30 hover:text-white/60'}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 space-y-1">
          <button onClick={() => navigate('/')} className="w-full font-mono text-xs text-white/20 hover:text-white/50 tracking-widest uppercase transition-colors py-1">← View Site</button>
          <button onClick={handleLogout} className="w-full font-mono text-xs text-red-400/30 hover:text-red-400/60 tracking-widest uppercase transition-colors py-1">Logout</button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden font-mono text-xs text-white/40 border border-white/10 px-3 py-1 mr-2">☰</button>
            <span className="font-mono text-xs text-white/20 tracking-widest uppercase hidden md:block">Admin</span>
            <span className="text-white/10 hidden md:block">/</span>
            <span className="font-mono text-xs text-gold tracking-widest uppercase">{NAV.find(n => n.id === activePage)?.label}</span>
          </div>
        </div>
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activePage} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}