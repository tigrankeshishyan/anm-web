import { anmHost } from '../../config'
import {
  sendResetLink as sendReset,
  sendVerificationEmail as sendCode
} from '../utils/sendinblue.util'

export async function sendResetLink (payload, helpers) {
  const { email, token, lang } = payload

  const link = `${anmHost}/${lang}/reset-password/${token}`
  await sendReset(email, link, lang)
}

export async function sendVerificationEmail (payload, helpers) {
  const { query } = helpers
  const { id, email, code, lang } = payload

  const response = await sendCode(email, code, lang)

  await query(
    `update app_public.email_verifications set sib_message_id=$1, status=$2
      where id=$3`,
    [response.messageId, 'verified', id]
  )
}
