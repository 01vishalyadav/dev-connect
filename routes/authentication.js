// authentication
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();

//api/users/authentication
/////////////authentication////////////////
router.post('/', async(req,res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // check if such user exist
  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Invalid email or password');
  // check if valid password is provided
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if(!isValidPassword)  return res.status(400).send('Invalid email or password');
  const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));
  res.send(token);
});


function validate (user){
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(4).max(255).required()
  });
  return schema.validate(user);
}

module.exports = router;