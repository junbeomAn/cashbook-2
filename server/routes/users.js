const express = require('express');
const fetch = require('node-fetch');
const { LOGIN_SUCCESS } = require('../utils/constant');
const { getAccessToken } = require('../utils/routes');
const auth = require('../utils/auth/jwt');
const { createUser } = require('../services/user-service');

const router = express.Router();

// github 로그인.

const oAuthUrl = 'https://github.com/login/oauth/authorize';
const postUrl = 'https://github.com/login/oauth/access_token';
const userInfoUrl = 'https://api.github.com/user';

const api = {
  requestJson: (url, options) => fetch(url, options).then((res) => res.json()),
  requestText: (url, options) => fetch(url, options).then((res) => res.text()),
};

router.get('/login', (req, res, next) => {
  // 다시 locahost:3000/?code=ADSAADDWQe으로 돌아가서
  const { token } = req.cookies;
  if (token) {
    const result = auth.verify(token);
    if (result.ok) {
      res.send({ ok: true, message: LOGIN_SUCCESS });
    }
  }
console.log(process.env);
  res.redirect(
    `${oAuthUrl}?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  );
});

router.post('/githubLogin', async (req, res) => {
  const { code } = req.body;

  try {
    const postData = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    };
    const postOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    };

    const response = await api.requestText(postUrl, postOptions);
    const accessToken = getAccessToken(response);

    const getOptions = {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`,
      },
    };
    const userInfo = await api.requestJson(`${userInfoUrl}`, getOptions);
    const result = {
      githubUserId: userInfo.id,
      nickname: userInfo.login,
      avatar: userInfo.avatar_url,
    };
    const { err, user } = await createUser(result);

    if (err) {
      res.send({ ok: false, err });
    }
    result.userId = user[0].dataValues.id;
    const token = auth.sign(result);

    res.cookie('token', token, {
      httpOnly: true,
    });
    res.send({ ok: true, result, message: LOGIN_SUCCESS });
  } catch (err) {
    console.error(err.message);
    res.send({ ok: false, err: err.message });
  }
});

module.exports = router;
