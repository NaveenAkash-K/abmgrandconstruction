const clientService = require('../services/clientService');
const asyncHandler = require('../utils/asyncHandler');

exports.getClients = asyncHandler(async (req, res, next) => {
  const { active } = req.query;

  const clients = await clientService.getAllClients({ active });

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

exports.getClient = asyncHandler(async (req, res, next) => {
  const client = await clientService.getClientById(req.params.id);

  res.status(200).json({
    success: true,
    data: client,
  });
});

exports.createClient = asyncHandler(async (req, res, next) => {
  const client = await clientService.createClient(req.body);

  res.status(201).json({
    success: true,
    data: client,
  });
});

exports.updateClient = asyncHandler(async (req, res, next) => {
  const client = await clientService.updateClient(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: client,
  });
});

exports.deleteClient = asyncHandler(async (req, res, next) => {
  await clientService.deleteClient(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Client deleted successfully',
  });
});

exports.toggleClient = asyncHandler(async (req, res, next) => {
  const client = await clientService.toggleClientStatus(req.params.id);

  res.status(200).json({
    success: true,
    data: client,
  });
});