const express = require('express');
const app = express();
const db = require('./db');
const usersRouter = require('./routes/users');


app.use(express.json());

app.use('/api/users', usersRouter);




app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});