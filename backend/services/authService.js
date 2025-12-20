const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new ErrorResponse('Please provide an email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new ErrorResponse('Your account has been deactivated', 401);
    }

    const token = user.getSignedJwtToken();

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    return user;
  }

  async updateUserDetails(userId, name, email) {
    const fieldsToUpdate = { name, email };

    const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    return user;
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      throw new ErrorResponse('Password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtToken();

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = new AuthService();
