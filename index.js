const express = require('express');
const app = express();
const db = require('./db');
const User = require('./models/user');


app.use(express.json());

app.get('/api/users', async (req, res) => {
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
// UPDATE user
app.put('/api/users/:id', async (req, res) => {
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
app.delete('/api/users/:id', async (req, res) => {
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



// CREATE a new user
app.post('/api/users', async (req, res) => {
  try {
    const reqData = req.body;

    const newUser = new User({
      name: reqData.name,
      email: reqData.email
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);

  } catch (err) {
    res.status(400).json({
      error: 'Error creating user',
      details: err.message
    });
  }
});

// GET user by ID
app.get('/api/users/:id', async (req, res) => {
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


app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});