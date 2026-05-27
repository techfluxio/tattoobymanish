const Video      = require('../models/Video');
const { cloudinary } = require('../config/cloudinary');

// GET /api/videos
const getVideos = async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const lim  = Math.min(parseInt(limit) || 20, 50);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * lim;

    const [videos, total] = await Promise.all([
      Video.find().sort({ createdAt: -1 }).skip(skip).limit(lim),
      Video.countDocuments(),
    ]);

    res.json({ success: true, total, videos });
  } catch (err) {
    next(err);
  }
};

// POST /api/videos  (protected)
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });

    const { title, category, duration } = req.body;
    if (!title) {
      await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'video' });
      return res.status(400).json({ success: false, message: 'Title required' });
    }

    // Cloudinary auto-generates a thumbnail at offset 0
    const thumbnailUrl = cloudinary.url(req.file.filename, {
      resource_type: 'video',
      format: 'jpg',
      transformation: [{ width: 800, crop: 'scale' }],
    });

    const video = await Video.create({
      title:        title.trim().slice(0, 100),
      category:     (category || 'Custom').trim().slice(0, 50),
      url:          req.file.path,
      publicId:     req.file.filename,
      thumbnailUrl,
      duration:     duration || '0:00',
    });

    res.status(201).json({ success: true, video });
  } catch (err) {
    next(err);
  }
};

// PUT /api/videos/:id  (protected)
const updateVideo = async (req, res, next) => {
  try {
    const { title, category, duration, featured } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, category, duration, featured },
      { new: true, runValidators: true }
    );
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, video });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/videos/:id  (protected)
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' });
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
    }
    await video.deleteOne();

    res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVideos, uploadVideo, updateVideo, deleteVideo };
