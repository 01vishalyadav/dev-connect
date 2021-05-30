const config = require('config');

module.exports = function(app) {
  
  if(app.get('env') === 'production'){
    if (!config.get('jwtPrivateKey'))
      throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    if(!config.get('db.user'))
      throw new Error('FATAL ERROR: db.user is not defined.');
    if(!config.get('db.password'))
      throw new Error('FATAL ERROR: db.password is not defined.');
  }
  else if(app.get('env') === 'development'){
    
  }
}