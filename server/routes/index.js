import express from 'express'

import images from './images/images.api'
import scores from './scores/scores.api'
import auth from './auth/auth.api'

const router = express.Router()

export default router
  .use('/images', images)
  .use('/scores', scores)
  .use('/auth', auth)
