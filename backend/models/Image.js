const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
    },
    mimetype: {
      type: String,
      required: [true, 'Mimetype is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    data: {
      type: String,
      required: [true, 'Image data is required'],
    },
    folder: {
      type: String,
      default: 'uploads',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
imageSchema.index({ folder: 1, createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);