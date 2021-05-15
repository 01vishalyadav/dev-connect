const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://localhost/dev-connect')
  .then(()=>console.log('connected to mongoDB...'));
}