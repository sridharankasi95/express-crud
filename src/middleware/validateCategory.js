const { createCategorySchema, updateCategorySchema } = require('../validations/categoryValidation');
const appError = require('../utils/appError');

module.exports = (schemaType) => {
  return (req, res, next) => {
    const schema =
      schemaType === 'create'
        ? createCategorySchema
        : updateCategorySchema;

    const { error, value } = schema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true
    });
    
    if (error) {
      return next(
        new appError(error.details[0].message, 400)
      );
    }

    req.body = value;
    next();
  };
};
