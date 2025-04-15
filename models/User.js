const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  imageUrl: String,
});

module.exports = mongoose.model('User', userSchema);
