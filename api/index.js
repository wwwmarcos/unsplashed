const { config } = require('./config')
const { bot } = require('./lib/bot')
const { unsplash } = require('./lib/unsplash')
const express = require('express')

const app = express()

bot.command('g', async (ctx) => {
  const { text } = ctx?.update?.message

  try {
    const DELIMITER = ' '
    const [, ...messageWithoutCommand] = text.split(DELIMITER)
    const finalText = messageWithoutCommand.join(DELIMITER)

    if (finalText === '') {
      return ctx.reply('no text provided, ex: /g lorem ipsum')
    }

    const jpegStream = await unsplash.generateRandomImage({ text: finalText })
    ctx.replyWithPhoto({ source: jpegStream })
  } catch (error) {
    console.error(error)
    ctx.reply('something wrong, try again later')
  }
})

app.use(bot.webhookCallback('/callback'))

app.get('/setup', async (_req, res) => {
  const url = `${config.currentHost}/callback`
  await bot.telegram.setWebhook(url)
  res.send(`listening on ${config.currentHost}`)
})

app.get('/', (_, res) => res.send('ok'))

if (config.DEV) {
  console.log('listening local')
  bot.launch()
}

app.listen(config.PORT,
  () => console.log(`running on ${config.PORT}`)
)
