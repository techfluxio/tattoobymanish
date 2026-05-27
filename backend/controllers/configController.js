const SiteConfig  = require('../models/SiteConfig');
const { cloudinary } = require('../config/cloudinary');

const getOrCreate = () =>
  SiteConfig.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main' } },
    { upsert: true, new: true }
  );

// GET /api/config
const getConfig = async (req, res, next) => {
  try {
    const cfg = await getOrCreate();
    res.json({ success: true, config: cfg });
  } catch (err) {
    next(err);
  }
};

// PUT /api/config/homepage  (protected)
const updateHomepage = async (req, res, next) => {
  try {
    const { tagline, subtagline } = req.body;
    const update = {};
    if (tagline)    update['homepage.tagline']    = tagline.slice(0, 100);
    if (subtagline) update['homepage.subtagline'] = subtagline.slice(0, 100);

    // If a new hero video file was uploaded
    if (req.file) {
      const cfg = await getOrCreate();
      // Delete old video from Cloudinary
      if (cfg.homepage?.heroVideoPublicId) {
        await cloudinary.uploader.destroy(cfg.homepage.heroVideoPublicId, { resource_type: 'video' });
      }
      update['homepage.heroVideoUrl']      = req.file.path;
      update['homepage.heroVideoPublicId'] = req.file.filename;
    }

    const cfg = await SiteConfig.findOneAndUpdate({ key: 'main' }, { $set: update }, { new: true, upsert: true });
    res.json({ success: true, homepage: cfg.homepage });
  } catch (err) {
    next(err);
  }
};

// PUT /api/config/about  (protected)
const updateAbout = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'experience', 'location', 'instagram', 'whatsapp', 'email'];
    const update  = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        update[`about.${field}`] = String(req.body[field]).slice(0, 1000);
      }
    });

    if (req.body.specialties !== undefined) {
      try {
        const specs = JSON.parse(req.body.specialties);
        update['about.specialties'] = specs.slice(0, 10).map(s => String(s).slice(0, 50));
      } catch {}
    }

    // Photo upload
    if (req.file) {
      const cfg = await getOrCreate();
      if (cfg.about?.photoPublicId) {
        await cloudinary.uploader.destroy(cfg.about.photoPublicId);
      }
      update['about.photoUrl']      = req.file.path;
      update['about.photoPublicId'] = req.file.filename;
    }

    const cfg = await SiteConfig.findOneAndUpdate({ key: 'main' }, { $set: update }, { new: true, upsert: true });
    res.json({ success: true, about: cfg.about });
  } catch (err) {
    next(err);
  }
};

// PUT /api/config/contact  (protected)
const updateContact = async (req, res, next) => {
  try {
    const allowed = ['instagram', 'instagramUrl', 'whatsapp', 'email'];
    const update  = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        update[`contact.${field}`] = String(req.body[field]).slice(0, 200);
      }
    });

    if (req.body.socials) {
      try {
        const socs = JSON.parse(req.body.socials);
        update['contact.socials'] = socs.slice(0, 10).map(s => ({
          platform: String(s.platform || '').slice(0, 30),
          handle:   String(s.handle   || '').slice(0, 80),
          url:      String(s.url      || '').slice(0, 200),
        }));
      } catch {}
    }

    const cfg = await SiteConfig.findOneAndUpdate({ key: 'main' }, { $set: update }, { new: true, upsert: true });
    res.json({ success: true, contact: cfg.contact });
  } catch (err) {
    next(err);
  }
};

module.exports = { getConfig, updateHomepage, updateAbout, updateContact };
