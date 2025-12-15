const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Planning'],
      default: 'Planning',
    },
    image: {
      type: String,
      required: [true, 'Please provide a project image'],
    },
    images: [
      {
        type: String,
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    category: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial', 'Infrastructure'],
      default: 'Commercial',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);