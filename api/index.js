const { config } = require('./config')
const { bot } = require('./lib/bot')
const { unsplash } = require('./lib/unsplash')
const { text } = require('./lib/text')

const express = require('express')

const app = express()

app.use(bot.webhookCallback('/callback'))
text.setupFonts()

const COMMAND_NAME = 'random'
bot.command(COMMAND_NAME, async ctx => {
  try {
    const delimiter = ' '
    const { text } = ctx?.update?.message
    const [, ...messageWithoutCommand] = text.split(delimiter)
    const finalText = messageWithoutCommand.join(delimiter)

    if (finalText === '') {
      return ctx.reply(`no text provided, ex: /${COMMAND_NAME} lorem ipsum`)
    }

    const jpegStream = await unsplash.generateRandomImage({ text: finalText })
    await ctx.replyWithPhoto({ source: jpegStream })
  } catch (error) {
    console.error(error)
    ctx.reply('something wrong, try again later')
  }
})

app.get('/setup', async (_req, res) => {
  const url = `${config.APP_HOST}/callback`
  await bot.telegram.setWebhook(url)
  res.send(`listening on ${config.APP_HOST}`)
})

app.get('/', (_, res) => res.send('ok'))

app.get('/generate', async (req, res) => {
  try {
    const { text } = req?.query
    const jpegStream = await unsplash.generateRandomImage({ text })
    jpegStream.pipe(res)
  } catch (error) {
    res.send({ message: 'error', error: error.message || error })
  }
})

if (config.DEV) {
  console.log('listening local')
  bot.launch()
}

app.listen(config.PORT,
  () => console.log(`running on ${config.PORT}`)
)
