const { createUserSchema } = require('../validations/userValidation');

module.exports = (req, res, next) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};
