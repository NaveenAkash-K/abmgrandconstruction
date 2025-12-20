const contactService = require('../services/contactService');
const asyncHandler = require('../utils/asyncHandler');

exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await contactService.getContact();

  res.status(200).json({
    success: true,
    data: contact,
  });
});

exports.createContact = asyncHandler(async (req, res, next) => {
  const contact = await contactService.createContact(req.body);

  res.status(201).json({
    success: true,
    data: contact,
  });
});

exports.updateContact = asyncHandler(async (req, res, next) => {
  const contact = await contactService.updateContact(req.body);

  res.status(200).json({
    success: true,
    data: contact,
  });
});

exports.deleteContact = asyncHandler(async (req, res, next) => {
  await contactService.deleteContact();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Contact information deleted successfully',
  });
});
