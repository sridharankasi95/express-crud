const express = require('express');
const app = express();

const cookieParser = require("cookie-parser");
const corsMiddleware = require("./config/cors");

const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes')

app.use(cookieParser());
app.use(corsMiddleware);

app.use(express.json());


app.use('/api/users', usersRouter);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);




module.exports = app;