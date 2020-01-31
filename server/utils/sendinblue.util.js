import axios from 'axios'

import { sendinblue } from '../../config'
import { Slack } from './slack.util'

const http = axios.create({
  headers: {
    'api-key': sendinblue.apiKey
  }
})

const contactUrl = `${sendinblue.url}/contacts`
const emailUrl = `${sendinblue.url}/smtp/email`

/**
 * @param {Object} data
 * @param {string} data.email
 * @param {string} [data.firstName]
 * @param {string} [data.lastName]
 */
export async function createContact (data) {
  const { userId, email, firstName, lastName } = data
  const listId = userId ? 7 : 6 // 7 is for registered users
  const body = {
    email,
    listIds: [listId],
    updateEnabled: true,
    attributes: {
      USER_ID: userId,
      FULLNAME: `${firstName || ''} ${lastName || ''}`,
      FIRSTNAME: firstName,
      LASTNAME: lastName
    }
  }

  const response = await http.post(contactUrl, body)

  return response.data
}

/**
 * @param {string} email
 */
export async function unsubscribeContact (email) {
  const body = {
    listIds: [12]
  }

  const response = await http.put(`${contactUrl}/${email}`, body)

  return response.status >= 200 && response.status < 300
}

export async function sendVerificationEmail (email, code) {
  const response = await http.post(emailUrl, {
    sender: { email: sendinblue.email },
    to: [{ email }],
    subject: 'Email verification code',
    htmlContent: `<h1> Your email verification code is ${code}</h1>`
  })

  return response.data
}

export async function sendWelcome (email, lang = '') {
  const ids = { en: 12, hy: 13 }
  const templateId = ids[lang] || ids.en

  try {
    const response = await http.post(emailUrl, {
      to: [{ email }],
      templateId
    })
    return response.data
  } catch (err) {
    Slack.devMessage(
      `failed to send welcome email to ${email}. ${err.message}`
    )
  }
}

export async function sendResetLink (email, link, lang = '') {
  const ids = { en: 14, hy: 15 }
  const templateId = ids[lang] || ids.en

  try {
    const response = await http.post(emailUrl, {
      to: [{ email }],
      templateId,
      params: {
        RESET_LINK: link
      }
    })
    return response.data
  } catch (err) {
    Slack.devMessage(
      `failed to send reset link email to ${email}. ${err.message}`
    )
    throw err
  }
}
