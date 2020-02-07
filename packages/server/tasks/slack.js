import { Slack } from '../utils/slack.util'

export async function sendMessage (payload, helpers) {
  const { message, user } = payload

  Slack.openMessage(message, user)
}
