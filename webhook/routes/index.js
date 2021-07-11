const express = require('express')
const router = express.Router()
const line = require('@line/bot-sdk')
const axios = require('axios')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const CLIENT_SECRET = process.env.CLIENT_SECRET
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const USERS_API = process.env.USERS_API
const WEBSITE_LINK = process.env.WEBSITE_LINK

const config = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CLIENT_SECRET,
}

router.post('/callback', line.middleware(config), (req, res, next) => {
  Promise.all(req.body.events.map(handleEvent)).then((result) => res.sendStatus(200))
})

const client = new line.Client(config)
async function handleEvent(event) {
  const luid = event.source.userId
  let isUser
  try {
    isUser = await _isUser(luid)
  } catch (err) {
    console.log(err)
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'Something went wrong! Sorry.',
    })
  }

  if (!isUser) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `You are not our members, please join us in ${WEBSITE_LINK}`,
    })
  }

  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null)
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text,
  })
}

async function _isUser(luid) {
  try {
    await axios.get(`${USERS_API}/users/${luid}`)
  } catch (err) {
    if (err.response && err.response.status >= 400 && err.response.status <= 499) {
      return false
    } else throw err
  }
  return true
}

module.exports = router
