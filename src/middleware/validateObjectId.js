const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid user ID', 400));
  }

  next();
};
