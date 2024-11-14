const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password:{
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    default: null,
    
  },
  lastName: {
    type: String,
    default: null,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  country: {
    type: String,
    default: null,
    
  },
  city: {
    type: String,
    default: null,
    
  },
  profileImage: {
    type: String,
    default: 'https://cdn.auth0.com/avatars/default.png', // Default Auth0 profile image
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
