import GraphileUpload from 'graphql-upload'

import bodyParser from 'body-parser'
import cors from 'cors'
import Express from 'express'
import locale from 'locale'
import passport from 'passport'
import Sentry from '@sentry/node'
import path from 'path'
import dirname from 'es-dirname'
import hbs from 'express-handlebars'

import { configurePassport } from './utils/passport.util'
import { errorHandler } from './utils/error.util'
import { port, sentryDSN, env, host } from '../config'
import { sessionMiddleware, useRespond } from './utils/express.util'
import GraphQL from './graph'
import routes from './routes'
import reqMiddleware from './middlewares'
import { dynamicRoutes } from './constants'
import pgClient from './pgClient'

const { graphqlUploadExpress } = GraphileUpload

const run = async () => {
  if (sentryDSN) {
    Sentry.init({ dsn: sentryDSN })
  }

  const app = new Express()

  await pgClient.connect()

  app.use(
    cors({
      origin: (origin, callback) => {
        if (env === 'production') {
          if (origin && !origin.endsWith(host)) {
            callback(new Error('Not allowed by CORS'))
            return
          }
        }

        return callback(null, true)
      },
      credentials: true
    })
  )

  app.engine('hbs', hbs({ extname: 'hbs' }))
  app.set('view engine', 'hbs')
  app.set('views', path.resolve(dirname(), './views'))

  const clientBuild = path.resolve(`${dirname()}/../client/build`)
  app.use(Express.static(clientBuild))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(sessionMiddleware)
  app.use(useRespond)
  app.use(dynamicRoutes, reqMiddleware)

  configurePassport(passport)

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(locale(new locale.Locales(['en', 'hy'], 'hy')))

  app.use(graphqlUploadExpress())
  app.use(GraphQL())

  app.use(routes)
  app.use('*', reqMiddleware)

  app.use(errorHandler)

  app.listen(port, () => {
    const msg = `Listening on port '${port}' at ${new Date().toISOString()}`
    console.log(msg)
  })
}

const close = () => {} // TODO: close connections

run().catch(err => console.error(err) || process.emit(err))

process.on('beforeExit', close)
