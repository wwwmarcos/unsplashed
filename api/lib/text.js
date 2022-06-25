const { createCanvas, registerFont, Image } = require('canvas')
const path = require('path')

const FONTS_PATH = path.join(process.cwd(), 'assets', 'fonts')
const FONTS = {
  BEAU_RIVAGE: {
    family: 'Beau Rivage',
    path: path.join(FONTS_PATH, 'BeauRivage-Regular.ttf'),
    size: 50
  },
  PUNK_TYPEWRITER: {
    family: 'Punk Typewriter',
    path: path.join(FONTS_PATH, 'PunkTypewriter.otf'),
    size: 60
  }
}

const setupFont = ({ path, family }) => {
  registerFont(path, { family })
}

const buildCanvas = ({ image: { width, height, path } }) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  const img = new Image()

  img.src = path

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return { canvas, ctx }
}

const buildTextLines = ({ text, ctx, boxSizes }) => {
  const words = text.split(' ')
  const lines = []
  let currentLine = []

  const appendLineToResult = (currentLine) => {
    const content = currentLine.join(' ')
    lines.push({ content })
  }

  while (words.length) {
    const word = words.shift()
    const nextLine = [...currentLine, word].join(' ')

    const futureText = ctx.measureText(
      nextLine,
      boxSizes.width,
      boxSizes.height
    )

    const containsSpaceOnCurrentLine = futureText.width < boxSizes.limit
    if (containsSpaceOnCurrentLine) {
      currentLine.push(word)
    } else {
      appendLineToResult(currentLine)
      currentLine = [word]
    }
  }

  appendLineToResult(currentLine)

  return lines
}

const updateCtxConfig = (ctx, { fillStyle, textAlign, font }) => {
  if (fillStyle) {
    ctx.fillStyle = fillStyle
  }

  if (textAlign) {
    ctx.textAlign = textAlign
  }

  if (font) {
    ctx.font = font
  }
}

const applyText = ({ font, text, image: { width, height, path } }) => {
  const { canvas, ctx } = buildCanvas({ image: { width, height, path } })

  updateCtxConfig(ctx, {
    textAlign: 'center',
    font: `${font.size}px ${font.family}`
  })

  const padding = {
    height: 200,
    width: 100
  }

  const boxSizes = {
    width: canvas.width / 2,
    height: canvas.height - (canvas.height - padding.height),
    limit: width - padding.width,
    lineSpace: 50
  }

  const lines = buildTextLines({
    text,
    ctx,
    boxSizes
  })

  const textBlockSize = lines.length * boxSizes.lineSpace
  const textBlockStart = (canvas.height - textBlockSize) / 2

  for (const [index, line] of lines.entries()) {
    updateCtxConfig(ctx, { fillStyle: 'black' })

    const measure = ctx.measureText(
      line.content,
      canvas.width,
      canvas.height
    )

    const linePosition = textBlockStart + index * boxSizes.lineSpace
    const background = {
      position: {
        y: linePosition - boxSizes.lineSpace + measure.emHeightDescent,
        x: boxSizes.width - measure.actualBoundingBoxLeft
      },
      width: measure.width,
      height: boxSizes.lineSpace
    }

    ctx.fillRect(
      background.position.x,
      background.position.y,
      background.width,
      background.height
    )

    updateCtxConfig(ctx, { fillStyle: 'white' })

    ctx.fillText(
      line.content,
      boxSizes.width,
      linePosition
    )
  }

  return canvas.createJPEGStream()
}

module.exports = {
  text: {
    applyText,
    setupFont,
    FONTS
  }
}
