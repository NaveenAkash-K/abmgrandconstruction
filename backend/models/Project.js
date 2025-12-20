const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Please provide a project image URL'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
      maxlength: [200, 'Location cannot be more than 200 characters'],
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'ONGOING', 'PLANNING'],
      default: 'Planning',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);