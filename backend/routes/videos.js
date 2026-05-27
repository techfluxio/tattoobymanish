const express  = require('express');
const router   = express.Router();
const { getVideos, uploadVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { protect }       = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { uploadVideo: multerVideo } = require('../config/cloudinary');

router.get('/',     getVideos);
router.post('/',    protect, uploadLimiter, multerVideo.single('video'), uploadVideo);
router.put('/:id',  protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

module.exports = router;
