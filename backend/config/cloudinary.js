const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------- Image Storage --------------------

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'tattoobymanish/images',
    allowed_formats: [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'heic',
      'heif'
    ],
    transformation: [
      {
        quality: 'auto',
        fetch_format: 'auto',
      },
    ],
    public_id: `img_${Date.now()}`,
  }),
});

// -------------------- Video Storage --------------------

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'tattoobymanish/videos',
    resource_type: 'video',
    allowed_formats: [
      'mp4',
      'mov',
      'm4v',
      'webm',
      'avi',
      'mpeg',
      'mpg'
    ],
    public_id: `vid_${Date.now()}`,
  }),
});

// -------------------- Universal File Filter --------------------

const fileFilter = (type) => (req, file, cb) => {
  const filename = file.originalname.toLowerCase();

  if (type === 'image') {
    if (
      file.mimetype.startsWith('image/') ||
      /\.(jpg|jpeg|png|webp|heic|heif)$/i.test(filename)
    ) {
      return cb(null, true);
    }
  }

  if (type === 'video') {
    if (
      file.mimetype.startsWith('video/') ||
      /\.(mp4|mov|m4v|webm|avi|mpeg|mpg)$/i.test(filename)
    ) {
      return cb(null, true);
    }
  }

  return cb(new Error('Invalid file type'), false);
};

// -------------------- Upload Middleware --------------------

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: fileFilter('image'),
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
  fileFilter: fileFilter('video'),
});

// -------------------- Exports --------------------

module.exports = {
  cloudinary,
  uploadImage,
  uploadVideo,
};
