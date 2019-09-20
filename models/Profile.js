const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  company: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  }
});
 
module.exports = Profile = mongoose.model('profile',ProfileSchema );