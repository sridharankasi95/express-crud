const express = require('express');
const app = express();

const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');


app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


module.exports = app;