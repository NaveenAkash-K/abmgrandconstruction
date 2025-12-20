const uploadService = require('../services/uploadService');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const folder = req.query.folder || 'uploads';
  const image = await uploadService.uploadSingleImage(req.file, folder);

  res.status(200).json({
    success: true,
    data: image,
  });
});

exports.uploadMultipleImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one file', 400));
  }

  const folder = req.query.folder || 'uploads';
  const images = await uploadService.uploadMultipleImages(req.files, folder);

  res.status(200).json({
    success: true,
    count: images.length,
    data: images,
  });
});


