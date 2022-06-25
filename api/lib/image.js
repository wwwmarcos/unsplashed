const axios = require('axios')
const os = require('os')
const fs = require('fs/promises')
const path = require('path')

const TEMP_DIR_IMAGE_PATH = path.join(os.tmpdir(), 'image.jpg')

const writeTmp = async ({ fileBuffer, path = TEMP_DIR_IMAGE_PATH }) => {
  await fs.writeFile(path, fileBuffer)
  return { path }
}

const getRemoteBuffer = async (url) => {
  const { data: file } = await axios.get(url, {
    responseType: 'arraybuffer'
  })

  return file
}

module.exports = {
  image: {
    getRemoteBuffer,
    writeTmp
  }
}
