const express = require('express')
const router = express.Router()
const axios = require('axios')
const querystring = require('querystring')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const USERS_API = process.env.USERS_API

router.get('/config', (req, res, next) => {
  res.send({ client_id: CLIENT_ID })
})

router.post('/register', async (req, res, next) => {
  const code = req.body.code
  let accessToken, luid
  try {
    accessToken = await _getAccessTokenByCode(code)
    luid = await _getLuidByAccessToken(accessToken)
    await _registerUser(luid)
  } catch (err) {
    return _handleAxiosError(res, err)
  }
  res.send({ accessToken, luid })
})

module.exports = router

function _handleAxiosError(res, err) {
  if (err.response) res.status(err.response.status).send(err.response.data)
  else {
    console.log(err)
    res.status(500).send('internal error')
  }
}

async function _registerUser(luid) {
  await axios.post(`${USERS_API}/register`, {
    luid,
  })
}

async function _getLuidByAccessToken(accessToken) {
  const res = await axios.get('https://api.line.me/v2/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return res.data.userId
}

async function _getAccessTokenByCode(code) {
  const res = await axios.post(
    'https://api.line.me/oauth2/v2.1/token',
    querystring.stringify({
      grant_type: 'authorization_code',
      redirect_uri: 'https://line-webhook-in-k8s.loca.lt/',
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  return res.data.access_token
}
