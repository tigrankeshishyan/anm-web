import express from 'express'

import { getImage } from './controllers/images.controller'

const router = express.Router()

export default router.get('/:id', getImage)
