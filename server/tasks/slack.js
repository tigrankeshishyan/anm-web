import { Slack } from '../../utils/slack.util'

export async function slackMessage (payload, helpers) {
  const { message, user } = payload

  Slack.contactMessage(message, user)
}
