const express = require('express');
// const users = require('../routes/users');
// const authentication = require('../routes/authentication');
// const error = require('../middlewares/error');

module.exports = function(app) {
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  // app.use('/api/users', users);
  // app.use('/api/authentication', authentication);
  // app.use(error);
}