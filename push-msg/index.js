const line = require('@line/bot-sdk')
const axios = require('axios')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const CLIENT_SECRET = process.env.CLIENT_SECRET
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const USERS_API = process.env.USERS_API

const config = {
  channelAccessToken: CHANNEL_ACCESS_TOKEN,
  channelSecret: CLIENT_SECRET,
}

const client = new line.Client(config)
const now = new Date()
const text = `Today is ${now.getFullYear()}/${
  now.getMonth() + 1
}/${now.getDate()}.\nTime is ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.`

axios.get(`${USERS_API}/users`).then((res) => {
  console.log(`receive users list from users api: ${JSON.stringify(res.data)}`)
  res.data.forEach((user) => {
    console.log(`push msg to ${user.luid}, text: ${text}`)
    client.pushMessage(user.luid, { type: 'text', text })
  })
})
