const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('config');


router.get('/github/callback', async(req, res) => {
  const requestToken = req.query.code;
  const clientId = config.get('oAuth.github.clientId');
  const clientSecret =config.get('oAuth.github.clientSecret');

  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/github/success');
  })

});

router.get('/github/success', (req,res) => {
  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    // res.render('pages/success',{ userData: response.data });
    console.log(response.data);
    res.send({userData:respnse.data});
  })
});

module.exports = router;