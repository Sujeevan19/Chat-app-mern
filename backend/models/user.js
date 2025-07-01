const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name:String,
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
password: {
    type: String,
    required: true,
  },timestamp: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model('User', userSchema);
module.exports = User;