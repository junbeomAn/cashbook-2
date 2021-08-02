const express = require('express');
const fetch = require('node-fetch');
const { LOGIN_SUCCESS_MSG } = require('../utils/constant');

const router = express.Router();
/* GET users listing. */
// github 로그인.

const oAuthUrl = 'https://github.com/login/oauth/authorize'; 
const postUrl = 'https://github.com/login/oauth/access_token';
const userInfoUrl = 'https://api.github.com/user';

router.get('/login', function(req, res, next) {
  res.redirect(`${oAuthUrl}?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`);
});

router.get('/githubLogin', async (req, res) => {
  const { code } = req.query;
  try {
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const accessToken = await fetch(`${postUrl}?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`, postOptions);
    const getOptions = {
      method: 'GET',
      headers: {
        'Authorization': `token ${accessToken}` 
      }
    }
    const userInfo = await fetch(`${userInfoUrl}`, getOptions);
    const result = {
      id: userInfo.id,
      nickname: userInfo.login
    }
    res.send({ ok: true, result, message: LOGIN_SUCCESS})
  } catch (err) {
    console.error(err);
  }

})

module.exports = router;
