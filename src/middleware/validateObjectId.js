const mongoose = require('mongoose');
const appError = require('../utils/appError');

module.exports = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new appError('Invalid user ID', 400));
  }

  next();
};
