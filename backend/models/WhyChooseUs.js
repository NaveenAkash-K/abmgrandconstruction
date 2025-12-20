const mongoose = require('mongoose');

const whyChooseUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Please provide an icon name'],
    },
    order: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

whyChooseUsSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('WhyChooseUs', whyChooseUsSchema);