const projectService = require('../services/projectService');
const asyncHandler = require('../utils/asyncHandler');

exports.getProjects = asyncHandler(async (req, res, next) => {
  const { status } = req.query;

  const projects = await projectService.getAllProjects({ status });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await projectService.getProjectById(req.params.id);

  res.status(200).json({
    success: true,
    data: project,
  });
});

exports.createProject = asyncHandler(async (req, res, next) => {
  const project = await projectService.createProject(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});

exports.updateProject = asyncHandler(async (req, res, next) => {
  const project = await projectService.updateProject(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: project,
  });
});

exports.deleteProject = asyncHandler(async (req, res, next) => {
  await projectService.deleteProject(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});