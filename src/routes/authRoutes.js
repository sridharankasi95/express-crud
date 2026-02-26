const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validateAuth');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const cors = require('../middleware/cors');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',cors, validate(loginSchema), authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);


module.exports = router;
