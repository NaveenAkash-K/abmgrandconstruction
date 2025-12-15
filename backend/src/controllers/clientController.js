const Client = require('../models/Client');
const Image = require('../models/Image');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Public
exports.getClients = asyncHandler(async (req, res, next) => {
  const { active, featured, industry, limit, page = 1 } = req.query;

  let query = {};

  // Filter by active status
  if (active === 'true') {
    query.isActive = true;
  } else if (active === 'false') {
    query.isActive = false;
  }

  // Filter by featured status
  if (featured === 'true') {
    query.featured = true;
  } else if (featured === 'false') {
    query.featured = false;
  }

  // Filter by industry
  if (industry) {
    query.industry = { $regex: industry, $options: 'i' };
  }

  let queryBuilder = Client.find(query).sort({ order: 1, createdAt: -1 });

  // Apply pagination
  if (limit) {
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;
    queryBuilder = queryBuilder.skip(skip).limit(limitNum);
  }

  const clients = await queryBuilder;
  const total = await Client.countDocuments(query);

  res.status(200).json({
    success: true,
    count: clients.length,
    total,
    page: parseInt(page),
    pages: limit ? Math.ceil(total / parseInt(limit)) : 1,
    data: clients,
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
exports.getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: client,
  });
});

// @desc    Create client
// @route   POST /api/clients
// @access  Private
exports.createClient = asyncHandler(async (req, res, next) => {
  const { name, logo, description, website, industry, projectsCompleted, order, featured, isActive } = req.body;

  // Validate required fields
  if (!name) {
    return next(new ErrorResponse('Please provide a client name', 400));
  }

  // If order is not provided, set it to the next highest order
  let orderValue = order;
  if (orderValue === undefined || orderValue === null) {
    const lastItem = await Client.findOne().sort({ order: -1 });
    orderValue = lastItem ? lastItem.order + 1 : 0;
  }

  const client = await Client.create({
    name,
    logo,
    description,
    website,
    industry,
    projectsCompleted: projectsCompleted || 0,
    order: orderValue,
    featured: featured || false,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    data: client,
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
exports.updateClient = asyncHandler(async (req, res, next) => {
  const { name, logo, description, website, industry, projectsCompleted, order, featured, isActive } = req.body;

  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  // Build update object with only provided fields
  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (logo !== undefined) updateFields.logo = logo;
  if (description !== undefined) updateFields.description = description;
  if (website !== undefined) updateFields.website = website;
  if (industry !== undefined) updateFields.industry = industry;
  if (projectsCompleted !== undefined) updateFields.projectsCompleted = projectsCompleted;
  if (order !== undefined) updateFields.order = order;
  if (featured !== undefined) updateFields.featured = featured;
  if (isActive !== undefined) updateFields.isActive = isActive;

  client = await Client.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: client,
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
exports.deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  // Delete associated logo image if exists
  if (client.logo) {
    try {
      const imageId = client.logo.split('/').pop();
      await Image.findByIdAndDelete(imageId);
    } catch (error) {
      console.error('Error deleting client logo:', error);
    }
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Client deleted successfully',
  });
});

// @desc    Reorder clients
// @route   PUT /api/clients/reorder
// @access  Private
exports.reorderClients = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return next(new ErrorResponse('Please provide an array of items with id and order', 400));
  }

  // Validate items array
  for (const item of items) {
    if (!item.id || item.order === undefined) {
      return next(new ErrorResponse('Each item must have an id and order', 400));
    }
  }

  // Update all items concurrently
  const updatePromises = items.map((item) =>
    Client.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
  );

  await Promise.all(updatePromises);

  // Fetch updated items
  const clients = await Client.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

// @desc    Toggle client active status
// @route   PUT /api/clients/:id/toggle
// @access  Private
exports.toggleClient = asyncHandler(async (req, res, next) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  client = await Client.findByIdAndUpdate(
    req.params.id,
    { isActive: !client.isActive },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: client,
  });
});

// @desc    Toggle client featured status
// @route   PUT /api/clients/:id/feature
// @access  Private
exports.toggleFeatured = asyncHandler(async (req, res, next) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
  }

  client = await Client.findByIdAndUpdate(
    req.params.id,
    { featured: !client.featured },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: client,
  });
});

// @desc    Get featured clients
// @route   GET /api/clients/featured
// @access  Public
exports.getFeaturedClients = asyncHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const clients = await Client.find({ featured: true, isActive: true })
    .sort({ order: 1 })
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

// @desc    Get clients by industry
// @route   GET /api/clients/industry/:industry
// @access  Public
exports.getClientsByIndustry = asyncHandler(async (req, res, next) => {
  const { industry } = req.params;

  const clients = await Client.find({
    industry: { $regex: industry, $options: 'i' },
    isActive: true,
  }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private
exports.getClientStats = asyncHandler(async (req, res, next) => {
  const totalClients = await Client.countDocuments();
  const activeClients = await Client.countDocuments({ isActive: true });
  const featuredClients = await Client.countDocuments({ featured: true });
  const totalProjects = await Client.aggregate([
    { $group: { _id: null, total: { $sum: '$projectsCompleted' } } },
  ]);

  // Get clients by industry
  const clientsByIndustry = await Client.aggregate([
    { $group: { _id: '$industry', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalClients,
      activeClients,
      featuredClients,
      totalProjectsCompleted: totalProjects[0]?.total || 0,
      clientsByIndustry,
    },
  });
});