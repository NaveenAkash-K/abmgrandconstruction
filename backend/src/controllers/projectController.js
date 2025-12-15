const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = asyncHandler(async (req, res, next) => {
  const { status, category, featured, active } = req.query;

  let query = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  if (active === 'true') query.isActive = true;

  const projects = await Project.find(query)
    .populate('client', 'name logo')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate('client', 'name logo');

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = asyncHandler(async (req, res, next) => {
  // Handle main image upload
  if (req.files && req.files.image) {
    const imageUrl = await uploadImageToFirebase(req.files.image[0], 'projects');
    req.body.image = imageUrl;
  }

  // Handle multiple images upload
  if (req.files && req.files.images) {
    const imageUrls = await Promise.all(
      req.files.images.map((file) => uploadImageToFirebase(file, 'projects'))
    );
    req.body.images = imageUrls;
  }

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  // Handle main image upload
  if (req.files && req.files.image) {
    // Delete old image
    if (project.image) {
      await deleteImageFromFirebase(project.image);
    }
    const imageUrl = await uploadImageToFirebase(req.files.image[0], 'projects');
    req.body.image = imageUrl;
  }

  // Handle multiple images upload
  if (req.files && req.files.images) {
    // Delete old images
    if (project.images && project.images.length > 0) {
      await Promise.all(project.images.map((img) => deleteImageFromFirebase(img)));
    }
    const imageUrls = await Promise.all(
      req.files.images.map((file) => uploadImageToFirebase(file, 'projects'))
    );
    req.body.images = imageUrls;
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  // Delete images from Firebase
  if (project.image) {
    await deleteImageFromFirebase(project.image);
  }
  if (project.images && project.images.length > 0) {
    await Promise.all(project.images.map((img) => deleteImageFromFirebase(img)));
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});