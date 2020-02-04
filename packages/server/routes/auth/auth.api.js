import express from 'express'
import passport from 'passport'

import { anmHost } from '../../../config'

const router = express.Router()

export default router
  .get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))
  .get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: `${anmHost}`,
    failureRedirect: `${anmHost}`
  }))
