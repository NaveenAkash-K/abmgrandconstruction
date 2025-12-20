const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');

class ProjectService {
  async getAllProjects(filters = {}) {
    const { status } = filters;
    let query = {};

    if (status) query.status = status;

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return projects;
  }

  async getProjectById(projectId) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }

    return project;
  }

  async createProject(projectData) {
    const { image, title, location, status } = projectData;

    const project = await Project.create({
      image,
      title,
      location,
      status,
    });

    return project;
  }

  async updateProject(projectId, projectData) {
    let project = await Project.findById(projectId);

    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }

    const { image, title, location, status } = projectData;

    const updateFields = {};
    if (image !== undefined) updateFields.image = image;
    if (title !== undefined) updateFields.title = title;
    if (location !== undefined) updateFields.location = location;
    if (status !== undefined) updateFields.status = status;

    project = await Project.findByIdAndUpdate(projectId, updateFields, {
      new: true,
      runValidators: true,
    });

    return project;
  }

  async deleteProject(projectId) {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ErrorResponse(`Project not found with id of ${projectId}`, 404);
    }

    await project.deleteOne();

    return { message: 'Project deleted successfully' };
  }
}

module.exports = new ProjectService();
