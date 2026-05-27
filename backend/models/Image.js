const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type:      String,
    required:  true,
    trim:      true,
    maxlength: 100,
  },
  category: {
    type:    String,
    required: true,
    trim:    true,
    maxlength: 50,
  },
  url: {
    type:     String,
    required: true,
  },
  publicId: {
    type:     String,
    required: true,
  },
  featured: {
    type:    Boolean,
    default: false,
  },
  order: {
    type:    Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Image', imageSchema);
