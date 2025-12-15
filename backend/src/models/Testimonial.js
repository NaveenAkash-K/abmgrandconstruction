const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    position: {
      type: String,
      maxlength: [100, 'Position cannot be more than 100 characters'],
    },
    company: {
      type: String,
      maxlength: [100, 'Company cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide testimonial content'],
      maxlength: [1000, 'Content cannot be more than 1000 characters'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Testimonial', testimonialSchema);