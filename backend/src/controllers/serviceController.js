const Service = require('../models/Service');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res, next) => {
  const { active } = req.query;

  let query = {};
  if (active === 'true') {
    query.isActive = true;
  }

  const services = await Service.find(query).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = asyncHandler(async (req, res, next) => {
  // Handle image upload if present
  if (req.file) {
    const imageUrl = await uploadImageToFirebase(req.file, 'services');
    req.body.image = imageUrl;
  }

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service,
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  // Handle image upload if present
  if (req.file) {
    // Delete old image
    if (service.image) {
      await deleteImageFromFirebase(service.image);
    }
    const imageUrl = await uploadImageToFirebase(req.file, 'services');
    req.body.image = imageUrl;
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: service,
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  // Delete image from Firebase
  if (service.image) {
    await deleteImageFromFirebase(service.image);
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});