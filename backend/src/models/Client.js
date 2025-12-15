const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a client name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    website: {
      type: String,
    },
    industry: {
      type: String,
      maxlength: [100, 'Industry cannot be more than 100 characters'],
    },
    projectsCompleted: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
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

// Index for faster queries
clientSchema.index({ order: 1, featured: -1 });

module.exports = mongoose.model('Client', clientSchema);