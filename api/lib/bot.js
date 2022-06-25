const { Telegraf } = require('telegraf')
const { config } = require('../config')

const bot = new Telegraf(config.BOT_TOKEN, {
  telegram: {
    webhookReply: false
  }
})

module.exports = {
  bot
}
