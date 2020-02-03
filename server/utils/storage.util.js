import aws from 'aws-sdk'
import sharp from 'sharp'
import uuid from 'uuid'

import { isUploadPDF } from './validate.util'
import {
  s3 as s3Config,
  maxImageSize,
  s3Bucket,
  scoreDocumentName,
  scorePreviewName
} from '../../config'
import { makePreview, addStamp } from './score.util'

const { S3 } = aws

const s3 = new S3({ ...s3Config })

export const AUDIO_PREFIX = 'audio'
export const CONTACT_ATTACHMENT_PREFIX = 'attachments'
export const IMAGE_PREFIX = 'images'
export const SCORE_PREFIX = 'scores'
export const USER_PREFIX = 'users'

/**
 * @param {string} key
 */
export async function headObject (key) {
  return s3
    .headObject({
      Bucket: s3Bucket,
      Key: key
    })
    .promise()
}

/**
 * @param {string} key
 */
export function getObject (key) {
  return s3
    .getObject({
      Key: key.startsWith('/') ? key.substring(1) : key,
      Bucket: s3Bucket
    })
}

export async function deleteObject (...keys) {
  const Objects = keys.map(k => ({ Key: k }))
  return s3
    .deleteObjects({
      Bucket: s3Bucket,
      Delete: { Objects }
    })
    .promise()
}

/**
 * @param {Upload} upload Multer file object.
 */
export async function uploadImage (upload) {
  const name = uuid()
  const s3Key = `${IMAGE_PREFIX}/${name}`
  const stream = sharp().resize(maxImageSize, maxImageSize, {
    fit: 'inside',
    withoutEnlargement: true
  })

  await s3
    .upload({
      Key: s3Key,
      Body: upload.createReadStream().pipe(stream),
      Bucket: s3Bucket,
      ContentDisposition: 'inline',
      ContentType: upload.mimetype
    })
    .promise()

  return s3Key
}

/**
 * @param {Upload} upload Multer file object.
 * @param {Object} args resolver arguments.
 * @param {Object} ctx resolver context.
 */
export async function uploadAvatar (upload, args, ctx) {
  const user = ctx.getUser()
  const s3Key = `${USER_PREFIX}/${user.id}/avatar.jpg`
  const stream = sharp()
    .resize(maxImageSize, maxImageSize, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg()

  const result = await s3
    .upload({
      Key: s3Key,
      Body: upload.createReadStream().pipe(stream),
      Bucket: s3Bucket,
      ACL: 'public-read',
      ContentDisposition: 'inline',
      ContentType: upload.mimetype
    })
    .promise()

  return result.Location
}

/**
 * @param {Upload} upload Multer file object.
 */
export async function uploadAudio (upload) {
  const s3Key = `${AUDIO_PREFIX}/${uuid()}`

  await s3
    .upload({
      Key: s3Key,
      Body: upload.createReadStream(),
      Bucket: s3Bucket,
      ContentDisposition: 'inline',
      ContentType: upload.mimetype
    })
    .promise()

  return s3Key
}

/**
 * @param {Upload} upload Multer file object.
 * @param {number} scoreId
 */
export async function uploadScore (upload, scoreId) {
  isUploadPDF(upload)

  const path = `${SCORE_PREFIX}/${scoreId}`
  const s3Key = `${path}/${scoreDocumentName}`

  await s3
    .upload({
      Key: s3Key,
      Body: upload.createReadStream(),
      Bucket: s3Bucket,
      ContentDisposition: 'inline',
      ContentType: upload.mimetype
    })
    .promise()

  return path
}

export async function addStampOnScore (scoreId, stamp) {
  const path = `${SCORE_PREFIX}/${scoreId}`
  const s3Key = `${path}/${scoreDocumentName}`

  const withStamp = await addStamp(scoreId, s3Key, stamp.right, stamp.center)

  await s3
    .upload({
      Key: s3Key,
      Body: withStamp,
      Bucket: s3Bucket,
      ContentDisposition: 'inline',
      ContentType: 'application/pdf'
    })
    .promise()

  return path
}

/**
 * @param {number} scoreId
 * @param {Object} opts
 */
export async function uploadScorePreview (scoreId, opts) {
  const stream = await makePreview(
    `${SCORE_PREFIX}/${scoreId}/${scoreDocumentName}`,
    'assets/watermark.png',
    opts
  )
  const path = `${SCORE_PREFIX}/${scoreId}`
  const s3Key = `${path}/${scorePreviewName}`
  await s3
    .upload({
      Key: s3Key,
      Body: stream,
      Bucket: s3Bucket,
      ContentDisposition: 'inline',
      ContentType: 'application/pdf',
      Metadata: {
        opts: JSON.stringify(opts)
      }
    })
    .promise()

  return s3Key
}

/**
 * @param {Upload} upload Multer file object.
 */
export async function uploadContactAttachment (upload) {
  const s3Key = `${CONTACT_ATTACHMENT_PREFIX}/${uuid()}`

  const { Location } = await s3
    .upload({
      Key: s3Key,
      Body: upload.createReadStream(),
      Bucket: s3Bucket,
      ACL: 'public-read',
      ContentDisposition: 'inline',
      ContentType: upload.mimetype
    })
    .promise()

  return Location
}

/**
 * @param {string} key Bucket ks3Bucket,
 */
export async function deleteImage (key) {
  return s3
    .deleteObject({
      Key: key,
      Bucket: s3Bucket
    })
    .promise()
}

/**
 * @param {string} key Bucket ks3Bucket,
 */
export async function deleteAudio (key) {
  return s3
    .deleteObject({
      Key: key,
      Bucket: s3Bucket
    })
    .promise()
}

/**
 * @typedef Upload
 * @property {string} filename Uploaded file name
 * @property {string} mimetype File mime type
 * @property {string} encoding
 * @property {Function} createReadStream [Function: createReadStream]
 */
