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
      required: [true, 'Please provide a logo URL'],
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

module.exports = mongoose.model('Client', clientSchema);