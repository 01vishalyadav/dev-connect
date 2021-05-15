const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
  // get token from the header of the request
  const token = req.header('x-auth-token');
  if(!token)  return res.status(401).send('Access denied. No token provided.');
  // it token provided, check for its validity
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    console.log('user authorised successfully');
    next();
  }
  catch(ex){
    res.status(400).send('Invalid token');
  }
}