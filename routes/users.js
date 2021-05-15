// const auth = require('../middleware/authorization');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
// const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// simple hello message for a get request
router.get('/', (req,res)=>{
  res.send("Hello: I am working!");
});


/////////////////// register a user//////////////////
router.post('/', async(req,res) => {
  // check if email, name etc are in valid format
  const { error } = validate(req.body);
  if (error)  return res.status(400).send(error.details[0].message);

  // now, user details are valid
  // check if the given email is already registered
  let user = await User.findOne({ email: req.body.email });
  if(user) return res.status(400).send('User already registered.');
  user = new User({
    email: req.body.email,
    firstName: req.body.firstName,
    password: req.body.password,
  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  // generate auth token
  const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  res.header('x-auth-token', token).send({
    _id:user._id,
    firstName:user.firstName,
    email: user.email,
  });
});


//////////////////// login a user///////////////


// update a user details

// delete a user

module.exports = router;