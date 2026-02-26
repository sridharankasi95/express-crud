const express = require('express');
const app = express();

const usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes')


app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


module.exports = app;