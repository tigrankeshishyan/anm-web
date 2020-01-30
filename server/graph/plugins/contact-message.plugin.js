
import GraphileUtils from 'graphile-utils'
import { Slack } from '../../utils/slack.util'

const { makeWrapResolversPlugin } = GraphileUtils

export default makeWrapResolversPlugin({
  Mutation: {
    createContactMessage (resolve, parent, args, ctx) {
      const user = ctx.getUser()
      const { input } = args

      Slack.contactMessage(input.contactMessage, user)

      return resolve()
    }
  }
})
