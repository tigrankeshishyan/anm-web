import os from 'os'
import path from 'path'

const requiredEnvVariables = [
  'CONNECTION_STRING',
  'FB_APP_ID',
  'FB_APP_SECRET',
  'S3_KEY',
  'S3_SECRET'
]

const warnOnMissing = ['SLACK_WEBHOOK_URL']

requiredEnvVariables.forEach(variable => {
  if (typeof process.env[variable] !== 'string') {
    throw Error(`'${variable}' is a required environment variable`)
  }
})

warnOnMissing.forEach(variable => {
  if (typeof process.env[variable] !== 'string') {
    console.warn(`'${variable}' is missing environment variable`)
  }
})

export const env = process.env.NODE_ENV || 'development'

export const port = process.env.PORT || 3000

export const apiPrefix = process.env.API_PREFIX || ''

export const host = 'anmmedia.am'

export const anmHost = process.env.HOST || `https://${host}`

export const anmUserWithHost = process.env.USER_HOST

export const adminHost =
  process.env.ADMIN_HOST || `https://admin.${host}`

export const PDFService = process.env.PDF_SERVICE || `https://${host}`

export const secret = process.env.APP_SECRET

export const sentryDSN = process.env.SENTRY_DSN

export const facebook = {
  appId: process.env.FB_APP_ID,
  appSecret: process.env.FB_APP_SECRET,
  callback: `${anmHost}${apiPrefix}/auth/facebook/callback`
}

export const database = {
  connectionString: process.env.CONNECTION_STRING,
  sessionTableName: 'sessions',
  schema: 'anm',
  schemaLocale: 'locale'
}

export const languages = ['hy', 'en']

export const s3 = {
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  endpoint: 'fra1.digitaloceanspaces.com'
}

export const s3Bucket = process.env.BUCKET

export const maxImageSize = 1024

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

export const github = {
  api: 'api.github.com',
  usernameToken: process.env.GH_UN_TOKEN,
  repoURL: process.env.GH_REPO
}

export const maxValidationAttempts = 3

export const uploadDir = path.join(os.tmpdir(), 'anm-server/upload')

export const scoreDocumentName = 'document.pdf'
export const scorePreviewName = 'preview.pdf'
export const scoreComingSoon = 'coming-soon.pdf'

export const slack = {
  webhook: process.env.SLACK_WEBHOOK || process.env.SLACK_WEBHOOK_URL,
  webUserActionsChannel: '#web-user-actions',
  devChannel: '#dev',
  defaultChannel: '#webhook-default'
}
