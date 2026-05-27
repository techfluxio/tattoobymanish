const express  = require('express');
const router   = express.Router();
const { getConfig, updateHomepage, updateAbout, updateContact } = require('../controllers/configController');
const { protect }       = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { uploadVideo: multerVideo, uploadImage: multerImage } = require('../config/cloudinary');

router.get('/', getConfig);
router.put('/homepage', protect, uploadLimiter, multerVideo.single('heroVideo'), updateHomepage);
router.put('/about',    protect, uploadLimiter, multerImage.single('photo'), updateAbout);
router.put('/contact',  protect, updateContact);

module.exports = router;
