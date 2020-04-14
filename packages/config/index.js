import os from 'os'
import path from 'path'
import dirname from 'es-dirname'

const requiredEnvVariables = [
  'APP_SECRET',
  'DATABASE_URL',
  'AUTH_DATABASE_URL',
  'FB_APP_ID',
  'FB_APP_SECRET',
  'S3_KEY',
  'S3_SECRET',
  'SLACK_WEBHOOK_URL'
]

requiredEnvVariables.forEach(variable => {
  if (typeof process.env[variable] !== 'string') {
    console.warn(`'${variable}' is a required environment variable`)
  }
})

export const env = process.env.NODE_ENV || 'development'

export const isProd = process.env.NODE_ENV === 'production'

export const isDev = process.env.NODE_ENV !== 'production'

export const port = process.env.PORT || 3000

export const host = 'anmmedia.am'

export const anmHost = process.env.HOST || `https://${host}`

export const adminHost = process.env.ADMIN_HOST || `https://admin.${host}`

export const PDFService = process.env.PDF_SERVICE || `https://${host}`

export const secret = process.env.APP_SECRET

export const sentryDSN = process.env.SENTRY_DSN

export const apolloEngineKey = process.env.ENGINE_API_KEY

export const facebook = {
  appId: process.env.FB_APP_ID,
  appSecret: process.env.FB_APP_SECRET,
  callback: `${anmHost}/auth/facebook/callback`
}

export const database = {
  url: process.env.DATABASE_URL,
  authUrl: process.env.AUTH_DATABASE_URL,
  sessionTableName: 'sessions',
  schema: 'app_public',
  schemaLocale: 'anm_locale'
}

export const worker = {
  concurrency: 1,
  pollInterval: 1000
}

export const languages = ['hy', 'en']

export const s3 = {
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  endpoint: 'fra1.digitaloceanspaces.com'
}

export const s3Bucket = process.env.BUCKET

export const maxImageSize = 2048

export const sendinblue = {
  url: 'https://api.sendinblue.com/v3',
  apiKey: process.env.SENDINBLUE_API_KEY,
  email: 'armeniannationalmusic@gmail.com'
}

export const currencies = ['USD', 'AMD', 'EUR']

export const paddle = {
  vendorId: process.env.PADDLE_ID,
  vendorCode: process.env.PADDLE_CODE,
  apiHost: 'https://vendors.paddle.com'
}

export const ameria = {
  clientId: process.env.AMERIA_CLIENT_ID,
  username: process.env.AMERIA_UN,
  password: process.env.AMERIA_PW
}

export const maxValidationAttempts = 3

export const uploadDir = path.join(os.tmpdir(), 'anm-server/upload')

export const scoreDocumentName = 'document.pdf'
export const scorePreviewName = 'preview.pdf'
export const scoreComingSoon = 'coming-soon.pdf'

export const buildDir =
  process.env.BUILD_PATH || path.join(dirname(), '/../client/build/')

export const slack = {
  webhook: process.env.SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL,
  webUserActionsChannel: '#web-user-actions',
  devChannel: '#dev',
  defaultChannel: '#webhook-default'
}
