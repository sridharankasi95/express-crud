const express = require('express');
const router = express.Router();
const User = require('../models/User');
const validateUser = require('../middleware/validateUser');

// GET all users
router.get('/', async (req, res) => {
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
router.post('/', validateUser, async (req, res) => {
   try {
  const user = await User.create(req.body);
  res.status(201).json(user);
} catch (err) {
    if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Email already exists"
    });
  }
  res.status(400).json({
    error: 'Error creating user',
    details: err.message
  });
}
});

// GET user by ID
router.get('/:id', async (req, res) => {
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
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const reqData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      reqData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);

  } catch (err) {
    res.status(400).json({
      error: 'Error updating user',
      details: err.message
    });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User deleted successfully'
    });

  } catch (err) {
    res.status(400).json({
      error: 'Error deleting user',
      details: err.message
    });
  }
});


module.exports = router;