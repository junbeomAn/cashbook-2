const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
/* GET users listing. */
// github 로그인.

const oAuthUrl = 'https://github.com/login/oauth/authorize'; 
const postUrl = 'https://github.com/login/oauth/access_token';

router.get('/login', function(req, res, next) {
  res.redirect(`${oAuthUrl}?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`);
});

router.get('/githubLogin', async (req, res) => {
  const { code } = req.query;
  try {
    const res = await fetch(`${postUrl}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`)
    console.log(res);
  } catch (err) {
    console.error(err);
  }

})

module.exports = router;
