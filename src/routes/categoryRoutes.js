const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validateCategory = require('../middleware/validateCategory');

router.post('/', validateCategory('create'), categoryController.createCategory);

module.exports = router;