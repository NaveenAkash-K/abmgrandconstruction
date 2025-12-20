const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    streetAddress: {
      type: String,
      required: [true, 'Please provide a street address'],
      trim: true,
      maxlength: [200, 'Street address cannot be more than 200 characters'],
    },
    cityAndZip: {
      type: String,
      required: [true, 'Please provide city and ZIP'],
      trim: true,
      maxlength: [100, 'City and ZIP cannot be more than 100 characters'],
    },
    country: {
      type: String,
      required: [true, 'Please provide a country'],
      trim: true,
      maxlength: [100, 'Country cannot be more than 100 characters'],
    },
    primaryPhone: {
      type: String,
      required: [true, 'Please provide a primary phone'],
      trim: true,
      maxlength: [20, 'Phone cannot be more than 20 characters'],
    },
    secondaryPhone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone cannot be more than 20 characters'],
    },
    primaryEmail: {
      type: String,
      required: [true, 'Please provide a primary email'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    secondaryEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    businessHoursWeekdays: {
      type: String,
      required: [true, 'Please provide weekday business hours'],
      trim: true,
      maxlength: [50, 'Business hours cannot be more than 50 characters'],
    },
    businessHoursSaturday: {
      type: String,
      required: [true, 'Please provide Saturday business hours'],
      trim: true,
      maxlength: [50, 'Business hours cannot be more than 50 characters'],
    },
    businessHoursSunday: {
      type: String,
      required: [true, 'Please provide Sunday business hours'],
      trim: true,
      maxlength: [50, 'Business hours cannot be more than 50 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Contact', contactSchema);