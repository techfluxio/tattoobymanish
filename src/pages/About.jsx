import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import PageTransition from '../components/ui/PageTransition';

export default function About() {
  const { about } = useData();

  return (
    <PageTransition>
      <div className="min-h-screen bg-obsidian pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Header */}
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-xs text-gold tracking-widest uppercase block mb-3">
            The Artist
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-white font-light mb-20">
            About Me
          </motion.h1>

          {/* Main */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mb-24">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.16,1,0.3,1] }}
              className="relative"
            >
              <div className="img-hover relative aspect-[3/4] overflow-hidden">
                <img src={about.photo} alt={about.name} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-gold/15 -z-10" />
              <div className="absolute -top-4 -left-4 w-1/3 h-1/3 border border-gold/10 -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16,1,0.3,1] }}
            >
              <div className="gold-line mb-8" />
              <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-2">{about.name}</h2>
              <p className="font-sans text-xs text-gold tracking-widest uppercase mb-8">{about.experience} · {about.location}</p>
              <p className="font-body text-white/60 text-lg md:text-xl leading-relaxed font-light mb-10">
                {about.bio}
              </p>

              {/* Specialties */}
              <div className="mb-10">
                <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-4">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {about.specialties.map(s => (
                    <span key={s} className="glass-gold border border-gold/20 px-4 py-2 font-sans text-xs text-gold tracking-widest uppercase">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-6">
                <a href={about.instagram} target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs text-white/40 hover:text-gold tracking-widest uppercase transition-colors">
                  Instagram
                </a>
                <a href={`https://wa.me/${about.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="font-sans text-xs text-white/40 hover:text-gold tracking-widest uppercase transition-colors">
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* Philosophy */}
          <div className="border-t border-white/5 pt-20">
            <div className="max-w-3xl">
              <motion.blockquote
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="font-display text-3xl md:text-5xl text-white font-light italic leading-relaxed"
              >
                "Skin is the most personal canvas there is. I don't just tattoo — I collaborate with your story."
              </motion.blockquote>
              <div className="gold-line mt-8" />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
