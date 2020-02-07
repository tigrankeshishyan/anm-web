import express from 'express'

import { getSitemap } from '../../utils/storage.util'

export default express.Router().get('/(:suffix).xml', function (req, res, next) {
  const { suffix } = req.params

  getSitemap(suffix)
    .createReadStream()
    .on('error', next)
    .pipe(res)
    .on('error', next)
})
