const uploadService = require('../services/uploadService');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const folder = req.query.folder || 'uploads';
  const image = await uploadService.uploadSingleImage(req.file, folder);

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

exports.uploadMultipleImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one file', 400));
  }

  const folder = req.query.folder || 'uploads';
  const images = await uploadService.uploadMultipleImages(req.files, folder);

  const uploadedImages = images.map((image) => ({
    id: image._id,
    url: `${req.protocol}://${req.get('host')}/api/upload/${image._id}`,
    filename: image.filename,
    originalName: image.originalName,
    mimetype: image.mimetype,
    size: image.size,
  }));

  res.status(200).json({
    success: true,
    count: uploadedImages.length,
    data: uploadedImages,
  });
});

exports.getImage = asyncHandler(async (req, res, next) => {
  const image = await uploadService.getImageById(req.params.id);

  const imageBuffer = Buffer.from(image.data, 'base64');

  res.set('Content-Type', image.mimetype);
  res.set('Content-Length', imageBuffer.length);
  res.set('Cache-Control', 'public, max-age=31536000');
  res.send(imageBuffer);
});

exports.getImageInfo = asyncHandler(async (req, res, next) => {
  const image = await uploadService.getImageInfo(req.params.id);

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

exports.deleteImage = asyncHandler(async (req, res, next) => {
  await uploadService.deleteImage(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Image deleted successfully',
  });
});

exports.deleteImageByUrl = asyncHandler(async (req, res, next) => {
  const { imageUrl } = req.body;

  await uploadService.deleteImageByUrl(imageUrl);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Image deleted successfully',
  });
});

exports.deleteMultipleImages = asyncHandler(async (req, res, next) => {
  const { imageIds } = req.body;

  const result = await uploadService.deleteMultipleImages(imageIds);

  res.status(200).json({
    success: true,
    data: {},
    message: `${result.deletedCount} images deleted successfully`,
  });
});

exports.getImages = asyncHandler(async (req, res, next) => {
  const { folder, page, limit } = req.query;

  const result = await uploadService.getAllImages({ folder, page, limit });

  const imagesWithUrls = result.images.map((image) => ({
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
    count: result.images.length,
    total: result.total,
    page: result.page,
    pages: result.pages,
    data: imagesWithUrls,
  });
});