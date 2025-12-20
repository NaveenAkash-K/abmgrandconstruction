const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await authService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await authService.updateUserDetails(req.user.id, name, email);

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const result = await authService.updatePassword(req.user.id, currentPassword, newPassword);

  res.status(200).json({
    success: true,
    token: result.token,
    user: result.user,
  });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {},
    message: 'Logged out successfully',
  });
});