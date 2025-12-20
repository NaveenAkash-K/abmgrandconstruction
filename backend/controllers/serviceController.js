const serviceService = require('../services/serviceService');
const asyncHandler = require('../utils/asyncHandler');

exports.getServices = asyncHandler(async (req, res, next) => {
  const { active } = req.query;

  const services = await serviceService.getAllServices({ active });

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

exports.getService = asyncHandler(async (req, res, next) => {
  const service = await serviceService.getServiceById(req.params.id);

  res.status(200).json({
    success: true,
    data: service,
  });
});

exports.createService = asyncHandler(async (req, res, next) => {
  const service = await serviceService.createService(req.body);

  res.status(201).json({
    success: true,
    data: service,
  });
});

exports.updateService = asyncHandler(async (req, res, next) => {
  const service = await serviceService.updateService(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: service,
  });
});

exports.deleteService = asyncHandler(async (req, res, next) => {
  await serviceService.deleteService(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});