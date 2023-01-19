const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');

router.get('/github/callback', async(req, res) => {
  const requestToken = req.query.code;
  const clientID = config.get('oAuth.github.clientID');
  const clientSecret = config.get('oAuth.github.clientSecret');
  console.log("**************************1**************");
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    console.log('inside github callback post request response');
    console.log("**************************2***********************");
    access_token = response.data.access_token;
    console.log("**************************3**************************"+access_token);
    axios({
      method: 'get',
      url: `https://api.github.com/user`,
      headers: {
        Authorization: 'token ' + access_token
      }
    }).then(async(response) => {
      console.log("**************************4**************");
      console.log("got response");
      const userData = response.data;
      if(req.app.get('env') !== 'production') {
        // console.log('response.data:************************************************************************************************************************************************************************', userData);
      }
      const nameArray = userData.name.split(" ") ? userData.name.split(" ") : null;
      console.log("name arr:", nameArray);
      let user = {
        email: response.data.email,
        firstName: nameArray ? nameArray[0] : "",
        lastName: nameArray.length === 2 ? nameArray[nameArray.length-1] : "",
        isOAuth: true,
        githubId: userData.login,
        publicReposCount: response.data.public_repos,
      }
      req.body.user = user;
      // check if such user exists
      try {
        user = await User.findOne({githubId: req.body.user.githubId});
      }
      catch(err) {
        if(err.constructor === MongooseError || "Operation `users.findOne()` buffering timed out after" in err) {
          user = null;
          // it will go to next else block so that new user will be created
        }
      }

      if(user) {
        // user exists
        console.log("**************************5**************");
        const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));  
        user = await User.findOneAndUpdate({githubId: req.body.user.githubId}, 
          {
            github_access_token: access_token,
            publicReposCount: req.body.user.publicReposCount,
          });
        console.log("*********token*******",token);
        res.send(token);
      }
      else {
        console.log("**************************6**************");
        // user does not exist
        user = new User({
          ...req.body.user,
          github_access_token: access_token,
        });
        await user.save();  
        const token = jwt.sign({_id:user._id}, config.get('jwtPrivateKey'));
        res.send(token);
      }
    }).catch(err => console.log('Axios error from getting user info, err:', err));
  }).catch(err => console.log('Error in getting response!'));
});

module.exports = router;