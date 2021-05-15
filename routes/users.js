const authorization = require('../middlewares/authorization');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const {User, validate, validateNonRequiredProperties} = require('../models/user');
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


//////////////////// get info about myself(user)///////////////
// make sure that request header contains auth token
router.get('/me', authorization, async(req,res)=>{
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
})

//////////  update a user details  //////////// 
// supported update (githubId, linkedinId, lastname)
router.put('/me', authorization, async(req,res)=>{
  let user = {
    githubId:null,
    linkedinId:null,
    lastName:null,
  }
  if(req.body.hasOwnProperty('githubId')){
    // check if this githubId already exist in db
    if( await User.findOne({githubId:req.body.githubId})){
      return res.status(400).send('githubId already registered.');
    }
    user.githubId = req.body.githubId;
  }
  if(req.body.hasOwnProperty('linkedinId')){
    if( await User.findOne({linkedinId:req.body.linkedinId})){
      return res.status(400).send('linkedinId already registered.');
    }
    user.linkedinId = req.body.linkedinId;
  }
  if(req.body.hasOwnProperty('lastName')){
    user.lastName = req.body.lastName;
  }
  // check if user object is still valid
  const { error } = validateNonRequiredProperties(user);
  if(error) return res.status(400).send(error.details[0].message);
  // user object is valid, now update the database
  await User.findByIdAndUpdate(req.user._id, {$set:
    {
      githubId: user.githubId,
      linkedinId: user.linkedinId,
      lastName: user.lastName,
    }
  }, {new:true}, (err,updatedDoc) =>{
    if(err){
      return res.status(400).send('Invalid request');
    }
    res.send(user);
  });
});

////////////  delete a user  ///////////
router.delete('/me', authorization, (req,res) => {
  User.findByIdAndDelete(req.user._id, (err,doc) => {
    if(err) return res.status(404).send('Could not perform delete');
    res.send('deleted successfully');
  });
});


module.exports = router;