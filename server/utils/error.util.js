import http from 'http'

/**
 * @param {Error} err
 */
export const silentError = err => console.error(err.message)

export class ExpressError extends Error {
  constructor (msg, code) {
    super()
    this.statusCode = code || 500
    this.message = msg
  }
}

export function errorHandler (err, req, res, next) {
  if (err !== null) {
    if (err instanceof ExpressError) {
      res
        .status(err.statusCode)
        .json({ status: 'error', message: err.message })
    } else {
      res
        .status(500)
        .send({ status: 'error', message: http.STATUS_CODES[500] })
    }
  }

  next()
}
