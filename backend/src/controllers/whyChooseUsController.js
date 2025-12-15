const WhyChooseUs = require('../models/WhyChooseUs');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all why choose us items
// @route   GET /api/why-choose-us
// @access  Public
exports.getWhyChooseUs = asyncHandler(async (req, res, next) => {
  const { active, limit } = req.query;

  let query = {};

  // Filter by active status if provided
  if (active === 'true') {
    query.isActive = true;
  } else if (active === 'false') {
    query.isActive = false;
  }

  let queryBuilder = WhyChooseUs.find(query).sort({ order: 1 });

  // Apply limit if provided
  if (limit) {
    queryBuilder = queryBuilder.limit(parseInt(limit));
  }

  const whyChooseUs = await queryBuilder;

  res.status(200).json({
    success: true,
    count: whyChooseUs.length,
    data: whyChooseUs,
  });
});

// @desc    Get single why choose us item
// @route   GET /api/why-choose-us/:id
// @access  Public
exports.getWhyChooseUsById = asyncHandler(async (req, res, next) => {
  const whyChooseUs = await WhyChooseUs.findById(req.params.id);

  if (!whyChooseUs) {
    return next(
      new ErrorResponse(`Why Choose Us item not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: whyChooseUs,
  });
});

// @desc    Create why choose us item
// @route   POST /api/why-choose-us
// @access  Private
exports.createWhyChooseUs = asyncHandler(async (req, res, next) => {
  const { title, description, icon, order, isActive } = req.body;

  // Validate required fields
  if (!title || !description || !icon) {
    return next(new ErrorResponse('Please provide title, description and icon', 400));
  }

  // If order is not provided, set it to the next highest order
  let orderValue = order;
  if (orderValue === undefined || orderValue === null) {
    const lastItem = await WhyChooseUs.findOne().sort({ order: -1 });
    orderValue = lastItem ? lastItem.order + 1 : 0;
  }

  const whyChooseUs = await WhyChooseUs.create({
    title,
    description,
    icon,
    order: orderValue,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    success: true,
    data: whyChooseUs,
  });
});

// @desc    Update why choose us item
// @route   PUT /api/why-choose-us/:id
// @access  Private
exports.updateWhyChooseUs = asyncHandler(async (req, res, next) => {
  const { title, description, icon, order, isActive } = req.body;

  let whyChooseUs = await WhyChooseUs.findById(req.params.id);

  if (!whyChooseUs) {
    return next(
      new ErrorResponse(`Why Choose Us item not found with id of ${req.params.id}`, 404)
    );
  }

  // Build update object with only provided fields
  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (icon !== undefined) updateFields.icon = icon;
  if (order !== undefined) updateFields.order = order;
  if (isActive !== undefined) updateFields.isActive = isActive;

  whyChooseUs = await WhyChooseUs.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: whyChooseUs,
  });
});

// @desc    Delete why choose us item
// @route   DELETE /api/why-choose-us/:id
// @access  Private
exports.deleteWhyChooseUs = asyncHandler(async (req, res, next) => {
  const whyChooseUs = await WhyChooseUs.findById(req.params.id);

  if (!whyChooseUs) {
    return next(
      new ErrorResponse(`Why Choose Us item not found with id of ${req.params.id}`, 404)
    );
  }

  await whyChooseUs.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Why Choose Us item deleted successfully',
  });
});

// @desc    Reorder why choose us items
// @route   PUT /api/why-choose-us/reorder
// @access  Private
exports.reorderWhyChooseUs = asyncHandler(async (req, res, next) => {
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
    WhyChooseUs.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
  );

  await Promise.all(updatePromises);

  // Fetch updated items
  const whyChooseUs = await WhyChooseUs.find().sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: whyChooseUs.length,
    data: whyChooseUs,
  });
});

// @desc    Toggle why choose us item active status
// @route   PUT /api/why-choose-us/:id/toggle
// @access  Private
exports.toggleWhyChooseUs = asyncHandler(async (req, res, next) => {
  let whyChooseUs = await WhyChooseUs.findById(req.params.id);

  if (!whyChooseUs) {
    return next(
      new ErrorResponse(`Why Choose Us item not found with id of ${req.params.id}`, 404)
    );
  }

  whyChooseUs = await WhyChooseUs.findByIdAndUpdate(
    req.params.id,
    { isActive: !whyChooseUs.isActive },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: whyChooseUs,
  });
});