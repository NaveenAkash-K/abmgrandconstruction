const User = require('../models/User');
const OTP = require('../models/OTP');
const ErrorResponse = require('../utils/errorResponse');
const nodemailer = require('nodemailer');

class AuthService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PASS) {
      console.warn('Email configuration missing. Password reset will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOTPEmail(email, otp) {
    if (!this.transporter) {
      throw new ErrorResponse('Email service not configured', 500);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - ABM Grand Construction',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            Password Reset Request
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;">You requested to reset your password. Use the OTP below to proceed:</p>
            <div style="background-color: white; padding: 20px; text-align: center; border-left: 3px solid #4CAF50; margin: 20px 0;">
              <h1 style="color: #4CAF50; font-size: 36px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="margin: 10px 0; color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
            <p style="margin: 10px 0; color: #666;">If you didn't request this, please ignore this email.</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            This is an automated email from ABM Grand Construction.
          </p>
        </div>
      `,
      text: `
Password Reset Request

You requested to reset your password. Use the OTP below to proceed:

OTP: ${otp}

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.

---
This is an automated email from ABM Grand Construction.
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send OTP email:', error.message);
      throw new ErrorResponse('Failed to send OTP email', 500);
    }
  }
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

  async forgotPassword(email) {
    if (!email) {
      throw new ErrorResponse('Please provide an email', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new ErrorResponse('No user found with that email', 404);
    }

    await OTP.deleteMany({ email: email.toLowerCase(), verified: false });

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    await this.sendOTPEmail(email, otp);

    return {
      message: 'OTP sent to your email. It will expire in 10 minutes.',
    };
  }

  async verifyOTPAndResetPassword(email, otp, newPassword) {
    if (!email || !otp || !newPassword) {
      throw new ErrorResponse('Please provide email, OTP, and new password', 400);
    }

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      throw new ErrorResponse('Invalid or expired OTP', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    user.password = newPassword;
    await user.save();

    otpRecord.verified = true;
    await otpRecord.save();

    await OTP.deleteMany({ email: email.toLowerCase() });

    const token = user.getSignedJwtToken();

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'Password reset successfully',
    };
  }
}

module.exports = new AuthService();
