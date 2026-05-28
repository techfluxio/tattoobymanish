import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import PageTransition from '../components/ui/PageTransition';

const icons = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.075.531 4.019 1.461 5.712L0 24l6.459-1.426C8.12 23.467 10.02 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.671-.487-5.224-1.34L3 21.719l1.081-3.698A9.954 9.954 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
    </svg>
  ),
};

export default function Contact() {
  const { contact } = useData();

  // FIX: Read YouTube data from contact.socials instead of hardcoding
  const youtube = contact.socials?.find(s => s.platform === 'YouTube');
  const youtubeUrl    = youtube?.url    || '#';
  const youtubeHandle = youtube?.handle
    ? (youtube.handle.startsWith('@') ? youtube.handle : `@${youtube.handle}`)
    : 'YouTube';

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-gold tracking-widest uppercase block mb-3">
            Get In Touch
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-white font-light mb-6">
            Contact
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="gold-line mb-16" />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="font-body text-white/45 text-lg leading-relaxed mb-12">
            Ready to start your tattoo journey? Reach out directly — Instagram DMs and WhatsApp are the fastest ways to connect.
          </motion.p>

          <div className="space-y-4">
            {/* Instagram */}
            <motion.a
              href={contact.instagramUrl} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="group flex items-center gap-5 glass border border-white/5 hover:border-gold/40 p-6 transition-all duration-400"
            >
              <div className="w-12 h-12 glass border border-white/10 flex items-center justify-center text-white/40 group-hover:text-gold group-hover:border-gold/30 transition-colors flex-shrink-0">
                {icons.Instagram}
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-white/30 tracking-widest uppercase mb-1">Instagram</p>
                <p className="font-display text-xl text-white group-hover:text-gold transition-colors">{contact.instagram}</p>
              </div>
              <span className="font-mono text-xs text-white/20 group-hover:text-gold transition-all duration-300 group-hover:translate-x-1">→</span>
            </motion.a>

            {/* WhatsApp */}
            <motion.a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="group flex items-center gap-5 glass border border-white/5 hover:border-gold/40 p-6 transition-all duration-400"
            >
              <div className="w-12 h-12 glass border border-white/10 flex items-center justify-center text-white/40 group-hover:text-gold group-hover:border-gold/30 transition-colors flex-shrink-0">
                {icons.WhatsApp}
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-white/30 tracking-widest uppercase mb-1">WhatsApp · Mobile</p>
                <p className="font-display text-xl text-white group-hover:text-gold transition-colors">{contact.whatsapp}</p>
              </div>
              <span className="font-mono text-xs text-white/20 group-hover:text-gold transition-all duration-300 group-hover:translate-x-1">→</span>
            </motion.a>

            {/* YouTube — FIX: dynamic data from contact.socials */}
            <motion.a
              href={youtubeUrl} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="group flex items-center gap-5 glass border border-white/5 hover:border-gold/40 p-6 transition-all duration-400"
            >
              <div className="w-12 h-12 glass border border-white/10 flex items-center justify-center text-white/40 group-hover:text-gold group-hover:border-gold/30 transition-colors flex-shrink-0">
                {icons.YouTube}
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-white/30 tracking-widest uppercase mb-1">YouTube</p>
                <p className="font-display text-xl text-white group-hover:text-gold transition-colors">{youtubeHandle}</p>
              </div>
              <span className="font-mono text-xs text-white/20 group-hover:text-gold transition-all duration-300 group-hover:translate-x-1">→</span>
            </motion.a>

            {/* Email */}
            <motion.a
              href={`mailto:${contact.email}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="group flex items-center gap-5 glass border border-white/5 hover:border-gold/40 p-6 transition-all duration-400"
            >
              <div className="w-12 h-12 glass border border-white/10 flex items-center justify-center text-white/40 group-hover:text-gold group-hover:border-gold/30 transition-colors flex-shrink-0">
                {icons.Email}
              </div>
              <div className="flex-1">
                <p className="font-sans text-xs text-white/30 tracking-widest uppercase mb-1">Email</p>
                <p className="font-display text-xl text-white group-hover:text-gold transition-colors">{contact.email}</p>
              </div>
              <span className="font-mono text-xs text-white/20 group-hover:text-gold transition-all duration-300 group-hover:translate-x-1">→</span>
            </motion.a>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}