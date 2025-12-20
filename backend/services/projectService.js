const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const uploadService = require('./uploadService');

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
    const { imageUrl, title, location, status } = projectData;

    const project = await Project.create({
      imageUrl,
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

    const { imageUrl, title, location, status } = projectData;

    if (imageUrl !== undefined && project.imageUrl && imageUrl !== project.imageUrl) {
      try {
        await uploadService.deleteImageByUrl(project.imageUrl);
      } catch (error) {
        console.error('Failed to delete old image:', error.message);
      }
    }

    const updateFields = {};
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
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

    if (project.imageUrl) {
      try {
        await uploadService.deleteImageByUrl(project.imageUrl);
      } catch (error) {
        console.error('Failed to delete image from Supabase:', error.message);
      }
    }

    await project.deleteOne();

    return { message: 'Project deleted successfully' };
  }
}

module.exports = new ProjectService();
