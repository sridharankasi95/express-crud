const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendEmail');
const { json } = require('express');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// REGISTER
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token
  });
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    token
  });
});
// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
      success: true,
      message: 'testing'
  });
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/reset-password/${resetToken}`;

  const message = `
    <p>You requested a password reset</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>This link is valid for 10 minutes.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Reset link sent to email'
    });

  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Email could not be sent', 500));
  }
});
// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  // check new password and confirm password match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError('Passwords do not match', 400));
  }
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = await bcrypt.hash(req.body.password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();  
  const token = signToken(user._id);
  res.status(200).json({
    success: true,
    token
  });
});

