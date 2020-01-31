import GraphileWorker from 'graphile-worker'

import { database, worker } from '../config'
import * as tasks from './tasks'

export default function run () {
  return GraphileWorker.run({
    connectionString: database.url,
    concurrency: worker.concurrency,
    pollInterval: worker.pollInterval,
    taskList: {
      ...tasks
    }
  })
}
