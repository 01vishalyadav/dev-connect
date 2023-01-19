const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
module.exports = function(app) {
  let connectionString = 'mongodb://localhost/dev-connect';
  if(app.get('env') === 'production'){
    connectionString = `mongodb+srv://${config.get('db.user')}:${config.get('db.password')}@cluster0.zrf8s.mongodb.net/dev-connect?retryWrites=true&w=majority`;
  }
  mongoose.connect(connectionString)
  .then(()=>console.log('connected to mongoDB...'))
  .catch(err => console.log("error in db connection:",err));
}