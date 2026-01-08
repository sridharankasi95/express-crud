const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email()
})
.min(1);

module.exports = { createUserSchema, updateUserSchema };