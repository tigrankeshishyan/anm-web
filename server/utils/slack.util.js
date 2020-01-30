import assert from 'assert'

import axios from 'axios'

import { slack, adminHost, anmHost } from '../config'

export class Slack {
  static async sendMessage ({ text, fields, channel }) {
    if (!slack.webhook) return

    try {
      assert.ok(channel, new Error('channel is not provided'))

      const payload = JSON.stringify({
        text,
        channel: channel || slack.defaultChannel,
        fields
      })

      await axios.post(slack.webhook, payload)
    } catch (err) {
      console.warn(`failed to send slack message, ${err.message}`)
    }
  }

  static newUser (user) {
    const name =
      user.firstName || user.lastName
        ? `${user.firstName || ''} ${user.lastName || ''}`
        : 'unknown'
    const link = user.email
      ? `<${adminHost}/users?filter=${user.email}|${user.email}>`
      : `id:${user.id}`

    const title = `New ${
      user.source ? `${user.source} ` : ''
    }user registration ${name} (${link})`.replace(/  +/g, ' ')

    Slack.sendMessage({
      text: title,
      fields: [{ title: 'Sent from ', value: `${anmHost}` }],
      channel: slack.webUserActionsChannel
    })
  }

  static newPurchase (user, purchase) {
    Slack.sendMessage({
      text: `New purchase (${purchase.id}) from (${user.id})`,
      channel: slack.webUserActionsChannel
    })
  }

  static invalidLogin (login, user) {
    Slack.sendMessage({
      text: `user: (${user.id}) tried to login but don't have password\nlogin: ${login}`
    })
  }

  static contactMessage (message, user) {
    const _user = user || { id: 'unknown' }
    const email = _user.email ? ` email(${_user.email})` : ''
    let str = `Message from user(${_user.id})${email}`

    for (const [key, value] of Object.entries(message)) {
      str += `\n${key}: ${value}`
    }

    Slack.sendMessage({ text: str, channel: slack.webUserActionsChannel })
  }

  static devMessage (msg) {
    Slack.sendMessage({ text: msg, channel: slack.devChannel })
  }
}
