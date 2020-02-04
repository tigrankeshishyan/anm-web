import GraphileWorker from 'graphile-worker'

import { database, worker } from '../config'
import * as emailTasks from './tasks/email'
import * as slackTasks from './tasks/slack'

export default async function run () {
  return GraphileWorker.run({
    connectionString: database.url,
    concurrency: worker.concurrency,
    pollInterval: worker.pollInterval,
    taskList: {
      ...emailTasks,
      ...slackTasks
    }
  })
}
