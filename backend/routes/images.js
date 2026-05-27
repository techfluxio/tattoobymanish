const express  = require('express');
const router   = express.Router();
const { getImages, uploadImage, updateImage, deleteImage } = require('../controllers/imageController');
const { protect }       = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { uploadImage: multerImage } = require('../config/cloudinary');

router.get('/',     getImages);
router.post('/',    protect, uploadLimiter, multerImage.single('image'), uploadImage);
router.put('/:id',  protect, updateImage);
router.delete('/:id', protect, deleteImage);

module.exports = router;
