import express from 'express'

import {
  getScore,
  purchaseFromPaddle,
  purchaseFromAmeria
} from './controllers/scores.controller'

const router = express.Router()

export default router
  .post('/purchase/paddle', purchaseFromPaddle)
  .get('/purchase/ameria', purchaseFromAmeria)
  .get('/*', getScore)
