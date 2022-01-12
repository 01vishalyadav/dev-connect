const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const users = require('../routes/users');
const conversations = require('../routes/conversations');
const authentication = require('../routes/authentication');
// const error = require('../middlewares/error');
const authorisation = require('../routes/oAuth');


module.exports = function(app) {
  // app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  // app.use(bodyparser.urlencoded({ extended: false }))
  // app.use(bodyparser.json());
  app.use('/api/users', users);
  // app.use('/api/conversations/:conversationId/messages', messages);
  app.use('/api/conversations', conversations);
  app.use('/api/users/authentication', authentication);
  // app.use(error);
}