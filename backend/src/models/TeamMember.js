const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    position: {
      type: String,
      required: [true, 'Please provide a position'],
      maxlength: [100, 'Position cannot be more than 100 characters'],
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot be more than 1000 characters'],
    },
    image: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
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

module.exports = mongoose.model('TeamMember', teamMemberSchema);