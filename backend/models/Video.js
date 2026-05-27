const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type:      String,
    required:  true,
    trim:      true,
    maxlength: 100,
  },
  category: {
    type:    String,
    trim:    true,
    maxlength: 50,
    default: 'Custom',
  },
  url: {
    type:     String,
    required: true,
  },
  thumbnailUrl: {
    type:    String,
    default: '',
  },
  publicId: {
    type:     String,
    required: true,
  },
  thumbnailPublicId: {
    type:    String,
    default: '',
  },
  duration: {
    type:    String,
    default: '0:00',
  },
  featured: {
    type:    Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
