const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
      maxlength: [20, 'Phone number cannot be more than 20 characters'],
    },
    siteLocation: {
      type: String,
      required: [true, 'Please provide a site location'],
      trim: true,
      maxlength: [200, 'Site location cannot be more than 200 characters'],
    },
    service: {
      type: String,
      required: [true, 'Please provide a service'],
      trim: true,
      maxlength: [100, 'Service cannot be more than 100 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quote', quoteSchema);
