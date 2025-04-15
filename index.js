const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));
  const port = process.env.PORT || 3000;
// Routes
app.use('/', userRoutes);

app.listen(port, '0.0.0.0',() => {
  console.log('🚀 Server running on http://localhost:3000');
});
