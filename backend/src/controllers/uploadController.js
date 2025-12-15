const { v4: uuidv4 } = require('uuid');
const path = require('path');
const Image = require('../models/Image');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new ErrorResponse('Please upload a valid image file (jpeg, jpg, png, gif, webp)', 400));
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return next(new ErrorResponse('Image size should not exceed 5MB', 400));
  }

  // Get folder from query or default to 'uploads'
  const folder = req.query.folder || 'uploads';

  // Convert buffer to base64
  const base64Data = req.file.buffer.toString('base64');
  const filename = `${uuidv4()}${path.extname(req.file.originalname)}`;

  // Save to MongoDB
  const image = await Image.create({
    filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    data: base64Data,
    folder,
  });

  // Generate URL for accessing the image
  const imageUrl = `${req.protocol}://${req.get('host')}/api/upload/${image._id}`;

  res.status(200).json({
    success: true,
    data: {
      id: image._id,
      url: imageUrl,
      filename: image.filename,
      originalName: image.originalName,
      mimetype: image.mimetype,
      size: image.size,
    },
  });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
exports.uploadMultipleImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one file', 400));
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024;

  // Validate all files
  for (const file of req.files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new ErrorResponse('Please upload valid image files (jpeg, jpg, png, gif, webp)', 400));
    }
    if (file.size > maxSize) {
      return next(new ErrorResponse('Each image size should not exceed 5MB', 400));
    }
  }

  // Get folder from query or default to 'uploads'
  const folder = req.query.folder || 'uploads';

  // Process all images
  const uploadedImages = [];

  for (const file of req.files) {
    const base64Data = file.buffer.toString('base64');
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    const image = await Image.create({
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: base64Data,
      folder,
    });

    const imageUrl = `${req.protocol}://${req.get('host')}/api/upload/${image._id}`;

    uploadedImages.push({
      id: image._id,
      url: imageUrl,
      filename: image.filename,
      originalName: image.originalName,
      mimetype: image.mimetype,
      size: image.size,
    });
  }

  res.status(200).json({
    success: true,
    count: uploadedImages.length,
    data: uploadedImages,
  });
});

// @desc    Get image by ID (serve image)
// @route   GET /api/upload/:id
// @access  Public
exports.getImage = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    return next(new ErrorResponse('Image not found', 404));
  }

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(image.data, 'base64');

  // Set content type and send image
  res.set('Content-Type', image.mimetype);
  res.set('Content-Length', imageBuffer.length);
  res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  res.send(imageBuffer);
});

// @desc    Get image info by ID
// @route   GET /api/upload/:id/info
// @access  Public
exports.getImageInfo = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id).select('-data');

  if (!image) {
    return next(new ErrorResponse('Image not found', 404));
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/api/upload/${image._id}`;

  res.status(200).json({
    success: true,
    data: {
      id: image._id,
      url: imageUrl,
      filename: image.filename,
      originalName: image.originalName,
      mimetype: image.mimetype,
      size: image.size,
      folder: image.folder,
      createdAt: image.createdAt,
    },
  });
});

// @desc    Delete image
// @route   DELETE /api/upload/:id
// @access  Private
exports.deleteImage = asyncHandler(async (req, res, next) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    return next(new ErrorResponse('Image not found', 404));
  }

  await image.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Image deleted successfully',
  });
});

// @desc    Delete image by URL
// @route   DELETE /api/upload
// @access  Private
exports.deleteImageByUrl = asyncHandler(async (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return next(new ErrorResponse('Please provide an image URL', 400));
  }

  // Extract image ID from URL
  const imageId = imageUrl.split('/').pop();

  const image = await Image.findById(imageId);

  if (!image) {
    return next(new ErrorResponse('Image not found', 404));
  }

  await image.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Image deleted successfully',
  });
});

// @desc    Delete multiple images
// @route   DELETE /api/upload/multiple
// @access  Private
exports.deleteMultipleImages = asyncHandler(async (req, res, next) => {
  const { imageIds } = req.body;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    return next(new ErrorResponse('Please provide an array of image IDs', 400));
  }

  const result = await Image.deleteMany({ _id: { $in: imageIds } });

  res.status(200).json({
    success: true,
    data: {},
    message: `${result.deletedCount} images deleted successfully`,
  });
});

// @desc    Get all images
// @route   GET /api/upload
// @access  Private
exports.getImages = asyncHandler(async (req, res, next) => {
  const { folder, page = 1, limit = 20 } = req.query;

  const query = {};
  if (folder) {
    query.folder = folder;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const images = await Image.find(query)
    .select('-data')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Image.countDocuments(query);

  const imagesWithUrls = images.map((image) => ({
    id: image._id,
    url: `${req.protocol}://${req.get('host')}/api/upload/${image._id}`,
    filename: image.filename,
    originalName: image.originalName,
    mimetype: image.mimetype,
    size: image.size,
    folder: image.folder,
    createdAt: image.createdAt,
  }));

  res.status(200).json({
    success: true,
    count: images.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: imagesWithUrls,
  });
});