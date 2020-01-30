import path from 'path'

import mime from 'mime-types'
import sharp from 'sharp'

import * as Storage from '../../../utils/storage.util'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export async function getImage (req, res, next) {
  try {
    const key = `${Storage.IMAGE_PREFIX}${req.path}`
    const width = parseInt(req.query.width) || undefined
    const height = parseInt(req.query.height) || undefined
    const fit = req.query.fit || undefined

    const ext = path.extname(key) || '.png'

    const trans = sharp().resize(width, height, {
      fit,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })

    switch (ext) {
      case '.jpg':
        trans.jpeg()
        break
      case '.webp':
        trans.webp()
        break
      default:
        trans.png()
    }

    res.contentType(mime.lookup(ext))

    return await Storage.getObject(key)
      .pipe(trans)
      .pipe(res)
  } catch (err) {
    next(err)
  }
}
