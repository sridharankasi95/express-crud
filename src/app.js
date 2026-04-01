const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsMiddleware = require("./config/cors");

const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes')


app.use(express.json());

app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.use(cookieParser());
app.use(corsMiddleware);


module.exports = app;