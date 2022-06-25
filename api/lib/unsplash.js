const { image } = require('./image')
const { text: textHelper } = require('./text')

const buildUnsplashURL = ({ width, height }) =>
  `https://source.unsplash.com/user/pawel_czerwinski/${width}x${height}`

async function generateRandomImage ({ text, selectedFont = textHelper.FONTS.PUNK_TYPEWRITER }) {
  const imageSettings = {
    width: 1080,
    height: 1920
  }

  const imageUrl = buildUnsplashURL(imageSettings)
  const fileBuffer = await image.getRemoteBuffer(imageUrl)
  const { path: imagePath } = await image.writeTmp({ fileBuffer })

  return textHelper.applyText({
    text,
    font: selectedFont,
    image: {
      width: imageSettings.width,
      height: imageSettings.height,
      path: imagePath
    }
  })
}

module.exports = {
  unsplash: {
    generateRandomImage
  }
}
