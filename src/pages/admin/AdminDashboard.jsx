import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, Link } from 'react-router-dom';

/* ── Icons ── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const NAV = [
  { id: 'overview',   label: 'Overview',   icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'gallery',    label: 'Photos',     icon: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
  { id: 'videos',     label: 'Videos',     icon: 'M15 10l4.553-2.07A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z' },
  { id: 'categories', label: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'about',      label: 'About Me',   icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
  { id: 'contact',    label: 'Contact',    icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
  { id: 'homepage',   label: 'Homepage',   icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2' },
];

/* ── Shared input style ── */
const inputStyle = {
  width: '100%',
  background: 'rgba(201,168,76,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#ffffff',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: '0.875rem',
  padding: '0.75rem 1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

function AdminInput({ label, value, onChange, placeholder, maxLength, type = 'text', hint }) {
  return (
    <div>
      <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', display: 'block', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginBottom: '0.4rem' }}>{hint}</p>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  );
}

function AdminTextarea({ label, value, onChange, rows = 4, maxLength, hint }) {
  return (
    <div>
      <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', display: 'block', marginBottom: '0.5rem' }}>
        {label}
      </label>
      {hint && <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginBottom: '0.4rem' }}>{hint}</p>}
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        style={{ ...inputStyle, resize: 'vertical' }}
        onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
      />
    </div>
  );
}

function SaveButton({ onClick, msg }) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <button onClick={onClick}
        style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.35)', color: '#C9A84C', padding: '0.65rem 1.8rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.2)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        Save Changes
      </button>
      <AnimatePresence>
        {msg && (
          <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: msg.includes('!') || msg === 'Saved!' ? '#C9A84C' : '#f87171' }}>
            {msg === 'Saved!' ? '✓ ' : '✕ '}{msg}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelCard({ title, children }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem', marginBottom: '1.5rem' }}>
      {title && (
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/* ── PANELS ── */

function OverviewPanel({ images, videos, categories, resetToDemo }) {
  const stats = [
    { label: 'Total Photos', value: images.length, icon: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
    { label: 'Total Videos', value: videos.length, icon: 'M15 10l4.553-2.07A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z' },
    { label: 'Categories', value: categories.length - 1, icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { label: 'Status', value: 'Live', icon: 'M5 12h14M12 5l7 7-7 7', isText: true },
  ];

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Dashboard</p>
        <h2 className="font-display text-4xl text-white font-light">Overview</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <motion.div key={s.label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.1)', padding: '1.5rem', cursor: 'default' }}>
            <div className="flex items-start justify-between mb-4">
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
              <span style={{ color: 'rgba(201,168,76,0.4)' }}><Icon d={s.icon} size={14} /></span>
            </div>
            <p className="font-display font-light" style={{ fontSize: s.isText ? '1.5rem' : '2.5rem', color: '#C9A84C' }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <PanelCard title="Quick Guide">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { nav: 'Photos', desc: 'Add or remove portfolio images. Paste an image URL from Cloudinary or any public host.' },
            { nav: 'Videos', desc: 'Manage tattoo process videos. Add via video URL and optional thumbnail.' },
            { nav: 'Categories', desc: 'Add, rename, or delete style categories used to filter the photo gallery.' },
            { nav: 'About Me', desc: 'Update your bio, photo, specialties, and personal contact details.' },
            { nav: 'Contact', desc: 'Edit the public contact info shown on the Contact page.' },
            { nav: 'Homepage', desc: 'Change the hero video URL and tagline displayed on the landing page.' },
          ].map(item => (
            <div key={item.nav} style={{ padding: '1rem', background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.4rem' }}>{item.nav}</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 flex items-center justify-between gap-4 flex-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
            Credentials: manish / TattooByManish@2024! — Set env vars in production.
          </p>
          <button
            onClick={() => { if (window.confirm('Reset ALL data to demo defaults? This cannot be undone.')) resetToDemo(); }}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.3rem 0.8rem', background: 'rgba(239,68,68,0.05)', cursor: 'pointer', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(239,68,68,0.9)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.6)'}
          >
            Reset to Demo Data
          </button>
        </div>
      </PanelCard>
    </div>
  );
}

function GalleryPanel({ images, addImage, deleteImage, categories }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blackwork');
  const [msg, setMsg] = useState('');

  const isValidUrl = (s) => { try { new URL(s); return true; } catch { return false; } };

  const handleAdd = () => {
    if (!url || !title) { setMsg('URL and title required.'); return; }
    if (!isValidUrl(url)) { setMsg('Enter a valid URL.'); return; }
    addImage({ src: url.replace(/[<>"]/g, ''), title: title.replace(/[<>"]/g, '').slice(0, 80), category });
    setUrl(''); setTitle(''); setMsg('Added!'); setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Admin</p>
        <h2 className="font-display text-4xl text-white font-light">Photo Management</h2>
      </div>

      <PanelCard title="Add New Photo">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-3">
            <AdminInput label="Image URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://res.cloudinary.com/..." maxLength={500} hint="Paste a Cloudinary or public image link" />
          </div>
          <div className="md:col-span-2">
            <AdminInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sacred Geometry" maxLength={80} />
          </div>
          <div>
            <label style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}>
              {categories.filter(c => c !== 'All').map(c => <option key={c} style={{ background: '#1a1a1a' }}>{c}</option>)}
            </select>
          </div>
        </div>
        <SaveButton onClick={handleAdd} msg={msg} />
      </PanelCard>

      <PanelCard title={`Current Photos (${images.length})`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group" style={{ aspectRatio: '1' }}>
              <img src={img.src} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}>
                <p className="font-sans text-xs text-white/80 text-center truncate w-full mb-1">{img.title}</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(201,168,76,0.7)', marginBottom: '0.5rem' }}>{img.category}</p>
                <button onClick={() => deleteImage(img.id)}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.25)', padding: '0.2rem 0.6rem', background: 'rgba(239,68,68,0.1)', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function VideosPanel({ videos, addVideo, deleteVideo }) {
  const [url, setUrl] = useState('');
  const [thumb, setThumb] = useState('');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [msg, setMsg] = useState('');

  const isValidUrl = (s) => { try { new URL(s); return true; } catch { return false; } };

  const handleAdd = () => {
    if (!url || !title) { setMsg('Video URL and title required.'); return; }
    if (!isValidUrl(url)) { setMsg('Enter a valid video URL.'); return; }
    addVideo({ src: url.replace(/[<>"]/g, ''), thumbnail: thumb.replace(/[<>"]/g, ''), title: title.replace(/[<>"]/g, '').slice(0, 80), duration: duration || '0:00', category: 'Custom' });
    setUrl(''); setThumb(''); setTitle(''); setDuration(''); setMsg('Added!'); setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Admin</p>
        <h2 className="font-display text-4xl text-white font-light">Video Management</h2>
      </div>

      <PanelCard title="Add New Video">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <AdminInput label="Video URL" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://res.cloudinary.com/...mp4" maxLength={500} hint="Cloudinary or public .mp4 link" />
          </div>
          <AdminInput label="Thumbnail URL" value={thumb} onChange={e => setThumb(e.target.value)} placeholder="https://... (optional)" maxLength={500} />
          <AdminInput label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Dragon Sleeve Timelapse" maxLength={80} />
          <AdminInput label="Duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 3:42" maxLength={10} />
        </div>
        <SaveButton onClick={handleAdd} msg={msg} />
      </PanelCard>

      <PanelCard title={`Current Videos (${videos.length})`}>
        <div className="space-y-3">
          {videos.map(v => (
            <div key={v.id} className="flex items-center gap-4 group"
              style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              {v.thumbnail
                ? <img src={v.thumbnail} alt="" className="flex-shrink-0 object-cover" style={{ width: 72, height: 44 }} />
                : <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 72, height: 44, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
                    <Icon d="M15 10l4.553-2.07A1 1 0 0 1 21 8.845v6.31a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" size={14} />
                  </div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-white truncate">{v.title}</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }} className="truncate">{v.src}</p>
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: 'rgba(201,168,76,0.5)', flexShrink: 0 }}>{v.duration}</span>
              <button onClick={() => deleteVideo(v.id)} className="flex-shrink-0"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(239,68,68,0.7)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.25rem 0.6rem', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.7)'}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function CategoriesPanel({ categories, addCategory, deleteCategory, editCategory }) {
  const [newCat, setNewCat] = useState('');
  const [editState, setEditState] = useState({});
  const [msg, setMsg] = useState('');
  const sanitize = (s) => s.replace(/[<>"'/]/g, '').slice(0, 30).trim();

  const handleAdd = () => {
    const cat = sanitize(newCat);
    if (!cat) { setMsg('Enter a name.'); return; }
    if (categories.includes(cat)) { setMsg('Already exists.'); return; }
    addCategory(cat); setNewCat(''); setMsg('Added!'); setTimeout(() => setMsg(''), 2500);
  };

  const handleEdit = (cat) => {
    const val = sanitize(editState[cat] || '');
    if (!val || categories.includes(val)) { setMsg('Invalid or duplicate.'); return; }
    editCategory(cat, val);
    setEditState(s => { const n = { ...s }; delete n[cat]; return n; });
    setMsg('Updated!'); setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Admin</p>
        <h2 className="font-display text-4xl text-white font-light">Categories</h2>
      </div>
      <PanelCard title="Add Category">
        <div className="flex gap-3">
          <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="e.g. Japanese" maxLength={30}
            style={{ ...inputStyle, flex: 1 }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
          <button onClick={handleAdd}
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.35)', color: '#C9A84C', padding: '0.75rem 1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0 }}>
            Add
          </button>
        </div>
        {msg && <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#C9A84C', marginTop: '0.75rem' }}>{msg}</p>}
      </PanelCard>

      <PanelCard title={`All Categories (${categories.length})`}>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat} className="flex items-center gap-3"
              style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="font-display text-white flex-1">{cat}</span>
              {cat === 'All'
                ? <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>DEFAULT</span>
                : <>
                    <input value={editState[cat] ?? ''} onChange={e => setEditState(s => ({ ...s, [cat]: e.target.value }))}
                      placeholder="Rename..." maxLength={30}
                      style={{ ...inputStyle, width: '9rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                    <button onClick={() => handleEdit(cat)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(201,168,76,0.7)', border: '1px solid rgba(201,168,76,0.2)', padding: '0.3rem 0.7rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                      Save
                    </button>
                    <button onClick={() => deleteCategory(cat)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: 'rgba(239,68,68,0.7)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.3rem 0.7rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
                      Delete
                    </button>
                  </>
              }
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function AboutPanel({ about, setAbout }) {
  const [form, setForm] = useState({ ...about });
  const [msg, setMsg] = useState('');
  const sanitize = (s, len = 500) => (s || '').replace(/[<>"]/g, '').slice(0, len);
  // Re-sync local form if context about changes (e.g. after save or reset)
  useEffect(() => { setForm({ ...about }); }, [about]);

  const save = () => {
    setAbout({
      ...form,
      name: sanitize(form.name, 60),
      bio: sanitize(form.bio, 500),
      location: sanitize(form.location, 100),
      experience: sanitize(form.experience, 20),
      photo: sanitize(form.photo, 300),
      instagram: sanitize(form.instagram, 200),
      whatsapp: sanitize(form.whatsapp, 20),
      email: sanitize(form.email, 100),
      specialties: (form.specialties || []).slice(0, 10),
    });
    setMsg('Saved!'); setTimeout(() => setMsg(''), 2500);
  };

  const f = (key) => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Admin</p>
        <h2 className="font-display text-4xl text-white font-light">About Page</h2>
      </div>

      <PanelCard title="Artist Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Artist Name" {...f('name')} placeholder="Manish Kumar" maxLength={60} />
          <AdminInput label="Experience" {...f('experience')} placeholder="10+ Years" maxLength={20} />
          <div className="md:col-span-2">
            <AdminInput label="Photo URL" {...f('photo')} placeholder="https://res.cloudinary.com/..." maxLength={300} hint="Profile photo shown on About page" />
          </div>
          <AdminInput label="Location" {...f('location')} placeholder="Ranchi, Jharkhand" maxLength={100} />
        </div>
      </PanelCard>

      <PanelCard title="Bio & Specialties">
        <div className="space-y-4">
          <AdminTextarea label="Bio" {...f('bio')} rows={5} maxLength={500} hint="Shown on the About page — max 500 characters" />
          <div>
            <AdminInput label="Specialties (comma separated)"
              value={(form.specialties || []).join(', ')}
              onChange={e => setForm(p => ({ ...p, specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10) }))}
              placeholder="Blackwork, Fine Line, Realism, Neo-Traditional" />
          </div>
        </div>
      </PanelCard>

      <PanelCard title="Personal Contact (not shown publicly)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdminInput label="Instagram URL" {...f('instagram')} placeholder="https://instagram.com/tattoobymanish" maxLength={200} />
          <AdminInput label="WhatsApp" {...f('whatsapp')} placeholder="+91 98765 43210" maxLength={20} />
          <AdminInput label="Email" {...f('email')} type="email" placeholder="ink@tattoobymanish.com" maxLength={100} />
        </div>
      </PanelCard>

      <SaveButton onClick={save} msg={msg} />
    </div>
  );
}

function ContactPanel({ contact, setContact }) {
  const [form, setForm] = useState({ ...contact });
  const [msg, setMsg] = useState('');
  const sanitize = (s, len = 200) => (s || '').replace(/[<>"]/g, '').slice(0, len);
  useEffect(() => { setForm({ ...contact }); }, [contact]);

  const save = () => {
    setContact({
      ...form,
      instagram: sanitize(form.instagram, 50),
      instagramUrl: sanitize(form.instagramUrl),
      whatsapp: sanitize(form.whatsapp, 20),
      email: sanitize(form.email, 100),
      location: sanitize(form.location, 100),
      socials: form.socials || contact.socials,
    });
    setMsg('Saved!'); setTimeout(() => setMsg(''), 2500);
  };

  const f = (key) => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Admin</p>
        <h2 className="font-display text-4xl text-white font-light">Contact Page</h2>
      </div>

      <PanelCard title="Public Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput label="Instagram Handle" {...f('instagram')} placeholder="@tattoobymanish" maxLength={50} />
          <AdminInput label="Instagram URL" {...f('instagramUrl')} placeholder="https://instagram.com/tattoobymanish" maxLength={200} />
          <AdminInput label="WhatsApp Number" {...f('whatsapp')} placeholder="+91 98765 43210" maxLength={20} />
          <AdminInput label="Email" {...f('email')} type="email" placeholder="ink@tattoobymanish.com" maxLength={100} />
        </div>
      </PanelCard>

      <SaveButton onClick={save} msg={msg} />
    </div>
  );
}

function HomepagePanel({ homepage, setHomepage }) {
  const [form, setForm] = useState({ ...homepage });
  const [msg, setMsg] = useState('');
  useEffect(() => { setForm({ ...homepage }); }, [homepage]);

  const save = () => {
    setHomepage({
      heroVideo: (form.heroVideo || '').replace(/[<>"]/g, '').slice(0, 300),
      tagline: (form.tagline || '').replace(/[<>"]/g, '').slice(0, 100),
      subtagline: (form.subtagline || '').replace(/[<>"]/g, '').slice(0, 100),
    });
    setMsg('Saved!'); setTimeout(() => setMsg(''), 2500);
  };

  const f = (key) => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div>
      <div className="mb-8">
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Admin</p>
        <h2 className="font-display text-4xl text-white font-light">Homepage</h2>
      </div>

      <PanelCard title="Hero Settings">
        <div className="space-y-4">
          <AdminInput label="Hero Video URL" {...f('heroVideo')} placeholder="/hero-bg.mp4 or Cloudinary URL" maxLength={300}
            hint="The background video for the homepage hero section. Use /hero-bg.mp4 to keep the local file." />
          <AdminInput label="Tagline" {...f('tagline')} placeholder="Art That Lives On Skin" maxLength={100} hint="Shown below the title (currently hidden — re-enable in Home.jsx if needed)" />
          <AdminInput label="Sub-tagline" {...f('subtagline')} placeholder="Premium Tattoo Artistry · Ranchi, India" maxLength={100} />
        </div>
      </PanelCard>

      <SaveButton onClick={save} msg={msg} />
    </div>
  );
}

/* ── Main Dashboard ── */
export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const {
    images, addImage, deleteImage,
    videos, addVideo, deleteVideo,
    categories, addCategory, deleteCategory, editCategory,
    about, setAbout,
    contact, setContact,
    homepage, setHomepage,
    resetToDemo,
  } = useData();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const renderPanel = () => {
    switch (activePage) {
      case 'overview':   return <OverviewPanel images={images} videos={videos} categories={categories} resetToDemo={resetToDemo} />;
      case 'gallery':    return <GalleryPanel images={images} addImage={addImage} deleteImage={deleteImage} categories={categories} />;
      case 'videos':     return <VideosPanel videos={videos} addVideo={addVideo} deleteVideo={deleteVideo} />;
      case 'categories': return <CategoriesPanel categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} editCategory={editCategory} />;
      case 'about':      return <AboutPanel about={about} setAbout={setAbout} />;
      case 'contact':    return <ContactPanel contact={contact} setContact={setContact} />;
      case 'homepage':   return <HomepagePanel homepage={homepage} setHomepage={setHomepage} />;
      default:           return null;
    }
  };

  return (
    <div className="min-h-screen flex text-white" style={{ background: '#080808' }}>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full md:h-auto z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col flex-shrink-0`}
        style={{ width: 220, background: 'linear-gradient(180deg, #0c0a07 0%, #0f0d09 100%)', borderRight: '1px solid rgba(201,168,76,0.1)' }}
      >
        {/* Logo */}
        <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.3rem' }}>Tattoo By</div>
            <div className="font-display font-semibold text-white uppercase tracking-widest" style={{ fontSize: '1.1rem' }}>Manish</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.3rem' }}>Admin Dashboard</div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {NAV.map(item => (
            <button key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 text-left transition-all duration-200"
              style={{
                padding: '0.7rem 1.5rem',
                background: activePage === item.id ? 'rgba(201,168,76,0.07)' : 'transparent',
                borderLeft: activePage === item.id ? '2px solid #C9A84C' : '2px solid transparent',
                color: activePage === item.id ? '#C9A84C' : 'rgba(255,255,255,0.3)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                borderLeft: activePage === item.id ? '2px solid #C9A84C' : '2px solid transparent',
              }}>
              <span style={{ opacity: activePage === item.id ? 1 : 0.5, flexShrink: 0 }}>
                <Icon d={item.icon} size={13} />
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 transition-colors duration-200"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', padding: '0.4rem 0' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
            <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={11} /> View Site
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 z-30 md:hidden" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />}

      {/* ── Main Content ── */}
      <div className="flex-1 min-h-screen flex flex-col min-w-0">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-8 flex-shrink-0"
          style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,8,0.95)' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden"
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', padding: '0.3rem 0.6rem', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem' }}>
              ☰
            </button>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Admin</span>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>/</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C' }}>
              {NAV.find(n => n.id === activePage)?.label}
            </span>
          </div>
          <button onClick={handleLogout}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', background: 'none', border: '1px solid rgba(255,255,255,0.08)', padding: '0.3rem 0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(239,68,68,0.8)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
            Logout
          </button>
        </div>

        {/* Panel */}
        <main className="flex-1 overflow-auto" style={{ padding: '2.5rem 2rem 3rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}>
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
