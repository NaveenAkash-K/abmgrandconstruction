const About = require('../models/About');
const ErrorResponse = require('../utils/errorResponse');

class AboutService {
  async getAbout() {
    const about = await About.findOne();
    return about;
  }

  async createAbout(data) {
    const { description, yearsOfExperience, completedProjects, locationsServed } = data;

    const existingAbout = await About.findOne();
    if (existingAbout) {
      throw new ErrorResponse('About section already exists. Please update instead.', 400);
    }

    const about = await About.create({
      description,
      yearsOfExperience,
      completedProjects,
      locationsServed,
    });

    return about;
  }

  async updateAbout(data) {
    const { description, yearsOfExperience, completedProjects, locationsServed } = data;

    let about = await About.findOne();

    if (!about) {
      throw new ErrorResponse('About section not found', 404);
    }

    const updateFields = {};
    if (description !== undefined) updateFields.description = description;
    if (yearsOfExperience !== undefined) updateFields.yearsOfExperience = yearsOfExperience;
    if (completedProjects !== undefined) updateFields.completedProjects = completedProjects;
    if (locationsServed !== undefined) updateFields.locationsServed = locationsServed;

    about = await About.findByIdAndUpdate(about._id, updateFields, {
      new: true,
      runValidators: true,
    });

    return about;
  }

  async deleteAbout() {
    const about = await About.findOne();

    if (!about) {
      throw new ErrorResponse('About section not found', 404);
    }

    await about.deleteOne();

    return { message: 'About section deleted successfully' };
  }
}

module.exports = new AboutService();
