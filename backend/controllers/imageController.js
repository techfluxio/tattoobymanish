const Image      = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

// GET /api/images
const getImages = async (req, res, next) => {
  try {
    const { category, limit, page } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const lim    = Math.min(parseInt(limit) || 50, 100);
    const skip   = (Math.max(parseInt(page) || 1, 1) - 1) * lim;

    const [images, total] = await Promise.all([
      Image.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim),
      Image.countDocuments(filter),
    ]);

    res.json({ success: true, total, images });
  } catch (err) {
    next(err);
  }
};

// POST /api/images  (protected — file uploaded via multer-cloudinary)
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const { title, category } = req.body;
    if (!title || !category) {
      // Clean up Cloudinary upload if validation fails
      await cloudinary.uploader.destroy(req.file.filename);
      return res.status(400).json({ success: false, message: 'Title and category required' });
    }

    const image = await Image.create({
      title:    title.trim().slice(0, 100),
      category: category.trim().slice(0, 50),
      url:      req.file.path,
      publicId: req.file.filename,
    });

    res.status(201).json({ success: true, image });
  } catch (err) {
    next(err);
  }
};

// PUT /api/images/:id  (protected)
const updateImage = async (req, res, next) => {
  try {
    const { title, category, featured } = req.body;
    const image = await Image.findByIdAndUpdate(
      req.params.id,
      { title, category, featured },
      { new: true, runValidators: true }
    );
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, image });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/images/:id  (protected)
const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();

    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getImages, uploadImage, updateImage, deleteImage };
