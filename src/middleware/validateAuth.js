const appError = require('../utils/appError');

module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new appError(error.details[0].message, 400));
  }
  next();
};
