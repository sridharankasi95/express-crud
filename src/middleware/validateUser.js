const { createUserSchema, updateUserSchema } = require('../validations/userValidation');
const AppError = require('../utils/AppError');

module.exports = (schemaType) => {
  return (req, res, next) => {
    const schema =
      schemaType === 'create'
        ? createUserSchema
        : updateUserSchema;

    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    });
    
    if (error) {
      return next(
        new AppError(error.details[0].message, 400)
      );
    }

    req.body = value;
    next();
  };
};
