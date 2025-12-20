const aboutService = require('../services/aboutService');
const asyncHandler = require('../utils/asyncHandler');

exports.getAbout = asyncHandler(async (req, res, next) => {
  const about = await aboutService.getAbout();

  res.status(200).json({
    success: true,
    data: about,
  });
});

exports.createAbout = asyncHandler(async (req, res, next) => {
  const about = await aboutService.createAbout(req.body);

  res.status(201).json({
    success: true,
    data: about,
  });
});

exports.updateAbout = asyncHandler(async (req, res, next) => {
  const about = await aboutService.updateAbout(req.body);

  res.status(200).json({
    success: true,
    data: about,
  });
});

exports.deleteAbout = asyncHandler(async (req, res, next) => {
  await aboutService.deleteAbout();

  res.status(200).json({
    success: true,
    data: {},
    message: 'About section deleted successfully',
  });
});
