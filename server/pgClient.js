import pg from 'pg'

import { database } from '../config'

const client = new pg.Client({
  connectionString: database.url
})

export default client
