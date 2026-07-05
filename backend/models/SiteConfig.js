const mongoose = require('mongoose');

// Single-document config store — we always upsert with key = 'main'
const siteConfigSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },

  homepage: {
    heroVideoUrl:      { type: String, default: '' },
    heroVideoPublicId: { type: String, default: '' },
    tagline:           { type: String, default: 'Art That Lives On Skin', maxlength: 100 },
    subtagline:        { type: String, default: 'Premium Tattoo Artistry · Delhi, India', maxlength: 100 },
  },

  about: {
    name:        { type: String, default: 'Manish Kumar', maxlength: 60 },
    photoUrl:    { type: String, default: '' },
    photoPublicId: { type: String, default: '' },
    bio:         { type: String, default: '', maxlength: 1000 },
    experience:  { type: String, default: '10+ Years', maxlength: 30 },
    location:    { type: String, default: 'Delhi, India', maxlength: 100 },
    specialties: [{ type: String, maxlength: 50 }],
    instagram:   { type: String, default: '' },
    whatsapp:    { type: String, default: '' },
    email:       { type: String, default: '' },
  },

  contact: {
    instagram:    { type: String, default: '@tattoobymanish' },
    instagramUrl: { type: String, default: '' },
    whatsapp:     { type: String, default: '' },
    email:        { type: String, default: '' },
    socials: [{
      platform: String,
      handle:   String,
      url:      String,
    }],
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
