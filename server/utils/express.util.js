import assert from 'assert'

import ConnectPg from 'connect-pg-simple'
import session from 'express-session'
import uuid from 'uuid'

import { ExpressError } from './error.util'
import * as config from '../config'
import * as Storage from '../utils/storage.util'

const sessionStore = new (ConnectPg(session))({
  conString: config.database.connectionString,
  tableName: config.database.sessionTableName,
  schemaName: config.database.schema
})

const maxAge = 30 * 24 * 60 * 60 * 1000

export const sessionMiddleware = session({
  store: sessionStore,
  secret: config.secret,
  cookie: { maxAge },
  resave: false,
  saveUninitialized: true,
  genid: () => uuid()
})

export function useRespond (req, res, next) {
  res.s3Object = async function (key) {
    const head = await Storage.headObject(key).catch(() => null)
    assert.ok(head, new ExpressError(`can't find object '${key}'`))
    res.contentType(head.ContentType)
    return Storage.getObject(key).pipe(res)
  }

  next()
}
