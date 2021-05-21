const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  githubId: {
    type: String,
    minlength: 2,
    maxlength: 50,
    default: null,
  },
  linkedinId: {
    type: String,
    minlength: 2,
    maxlength: 50,
    default: null,
  },
  privateProperties: {
    type: [String]
  },
  followingTags: {
    type: [ObjectId]
  },
  followingUsers:{
    type: [ObjectId],
  },
  followedByUsers: {
    type: [ObjectId],
  },
  blockedUsers: {
    type: [ObjectId],
  },
  friends: {
    type: [ObjectId],
  },
  isConnected: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

function validateUser(user) {
  console.log(user.firstName);
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required(),
    githubId: Joi.string().min(2).max(50).allow(null),
    linkedinId: Joi.string().allow(null).min(2).max(50),
  });
  return schema.validate(user);
}

function validateNonRequiredProperties(user){
  const schema = Joi.object({
    lastName: Joi.string().allow(null).min(3).max(50),
    githubId: Joi.string().allow(null).min(2).max(50),
    linkedinId: Joi.string().allow(null).min(2).max(50),
  });
  return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser;
exports.validateNonRequiredProperties = validateNonRequiredProperties;