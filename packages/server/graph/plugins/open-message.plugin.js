import GraphileUtils from 'graphile-utils'

import { Slack } from '../../utils/slack.util'

const { makeWrapResolversPlugin } = GraphileUtils

export default makeWrapResolversPlugin({
  Mutation: {
    createOpenMessage: {
      requires: {
        childColumns: [{ alias: 'message', column: 'message' }]
      },
      async resolve (resolve) {
        const resolved = await resolve()

        Slack.openMessage(resolved.data['@openMessage'])

        return resolve
      }
    }
  }
})
