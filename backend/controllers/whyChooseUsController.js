const whyChooseUsService = require('../services/whyChooseUsService');
const asyncHandler = require('../utils/asyncHandler');

exports.getWhyChooseUs = asyncHandler(async (req, res, next) => {
  const { limit } = req.query;

  const whyChooseUs = await whyChooseUsService.getAllWhyChooseUs({ limit });

  res.status(200).json({
    success: true,
    count: whyChooseUs.length,
    data: whyChooseUs,
  });
});

exports.getWhyChooseUsById = asyncHandler(async (req, res, next) => {
  const whyChooseUs = await whyChooseUsService.getWhyChooseUsById(req.params.id);

  res.status(200).json({
    success: true,
    data: whyChooseUs,
  });
});

exports.createWhyChooseUs = asyncHandler(async (req, res, next) => {
  const whyChooseUs = await whyChooseUsService.createWhyChooseUs(req.body);

  res.status(201).json({
    success: true,
    data: whyChooseUs,
  });
});

exports.updateWhyChooseUs = asyncHandler(async (req, res, next) => {
  const whyChooseUs = await whyChooseUsService.updateWhyChooseUs(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: whyChooseUs,
  });
});

exports.deleteWhyChooseUs = asyncHandler(async (req, res, next) => {
  await whyChooseUsService.deleteWhyChooseUs(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Why Choose Us item deleted successfully',
  });
});

exports.reorderWhyChooseUs = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  const whyChooseUs = await whyChooseUsService.reorderWhyChooseUs(items);

  res.status(200).json({
    success: true,
    count: whyChooseUs.length,
    data: whyChooseUs,
  });
});