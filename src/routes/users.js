const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validateUser = require('../middleware/validateUser');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const validateObjectId = require('../middleware/validateObjectId');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const bcrypt = require('bcryptjs');

// GET all users
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {

    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching users',
      details: err.message
    });
  }
});
// CREATE a new user
router.post('/', protect, restrictTo('admin'), validateUser('create'), catchAsync(async (req, res, next) => {
 
  const user = await User.create(req.body);
  
  res.status(201).json(user);


}));

// GET user by ID
router.get('/:id', protect, async (req, res) => {
  try {

    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(400).json({
      error: 'Invalid user ID',
      details: err.message
    });
  }
});
// UPDATE user
router.put('/:id', protect,  validateObjectId, restrictTo('admin'), validateUser('update'), catchAsync(async (req, res, next) => {

    const userId = req.params.id;
    const reqData = req.body;
    delete reqData.password;
    delete reqData.role;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      reqData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
    return next(new AppError('User not found', 404));
    }

    res.status(200).json(updatedUser);

  }
));

// DELETE user
router.delete('/:id', protect, validateObjectId, restrictTo('admin'), catchAsync(async (req, res, next) => {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      message: 'User deleted successfully'
    });

  }
));


module.exports = router;