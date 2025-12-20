const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Years of experience cannot be negative'],
    },
    completedProjects: {
      type: Number,
      required: [true, 'Please provide number of completed projects'],
      min: [0, 'Completed projects cannot be negative'],
    },
    locationsServed: {
      type: Number,
      required: [true, 'Please provide number of locations served'],
      min: [0, 'Locations served cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('About', aboutSchema);
