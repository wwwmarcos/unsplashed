require('dotenv').config()

const config = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  DEV: process.env.NODE_ENV === 'dev',
  PORT: 3000,
  INSTAGRAM: {
    LOGIN: process.env.INSTAGRAM_LOGIN,
    PASSWORD: process.env.INSTAGRAM_PASSWORD
  }
}

module.exports = {
  config
}
