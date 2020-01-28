import axios from 'axios'

import { PDFService, s3Bucket } from '../config'

function watermarkOpts (waterPath, waterOpts) {
  if (!waterPath) {
    return ''
  }
  const opts = waterOpts ? `&waterOpts=${waterOpts}` : ''
  return `&waterPath=${waterPath}${opts}`
}

function parseOpts (opts) {
  const {
    scaleFactor,
    scalePosition,
    rotation,
    opacity,
    pages,
    watermarkPages
  } = opts
  let options = ''

  if (scaleFactor) {
    options += `s:${scaleFactor}`
    if (scalePosition) {
      if (scalePosition === 'abs' || scalePosition === 'rel') {
        options += ` ${scalePosition}`
      } else {
        throw Error(
          `invalid scale factor position ${scalePosition}, can be 'abs' or 'rel'`
        )
      }
    }
  }
  if (rotation !== undefined) {
    options += `,rotation:${rotation}`
  }
  if (opacity !== undefined) {
    options += `,opacity:${opacity}`
  }

  return {
    options,
    pages:
      pages && pages.length ? pages.map(page => `&pages=${page}`).join('') : '',
    watermarkPages:
      watermarkPages && watermarkPages.length
        ? watermarkPages.map(page => `&waterPages=${page}`).join('')
        : ''
  }
}

/**
 * @param {string} path
 * @param {string} waterPath
 * @param {Object} opts
 */
export async function makePreview (path, waterPath, opts) {
  const { options, pages, watermarkPages } = parseOpts(opts)

  const waterQuery = watermarkOpts(waterPath, options)

  const url = `${PDFService}/preview?bucket=${s3Bucket}&path=${path}${pages}${waterQuery}${watermarkPages}`
  const response = await axios.get(url, { responseType: 'stream' })

  return response.data
}

/**
 * @param {number} scoreId
 * @param {string} path
 * @param {string} rightPages
 * @param {string} centerPages
 */
export async function addStamp (scoreId, path, rightPages, centerPages) {
  const stamp = `ANM-${scoreId}`

  const stampPages = `right=${rightPages || '1'}&center=${centerPages || '2-'}`
  const url = `${PDFService}/stamp?bucket=${s3Bucket}&path=${path}&stamp=${stamp}&${stampPages}`
  const response = await axios.get(url, { responseType: 'stream' })

  return response.data
}
