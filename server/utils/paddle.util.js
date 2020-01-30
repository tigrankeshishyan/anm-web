import axios from 'axios'
import moment from 'moment'

import { paddle, anmHost } from '../config'

const payLinkPath = '/api/2.0/product/generate_pay_link'
const generatePayLink = `${paddle.apiHost}${payLinkPath}`

export async function buyLink ({
  title,
  passthrough,
  price,
  email,
  country,
  returnUrl
}) {
  const expires = moment().format('YYYY-MM-DD') // expires on same day

  const body = makeBody({
    title,
    expires,
    email,
    price,
    country,
    passthrough,
    returnUrl
  })

  const { data } = await axios.post(generatePayLink, body)

  if (!data.success) {
    const { error } = data
    throw Error(error.message + `. error code ${error.code}`)
  }

  return data.response.url
}

function makeBody ({
  title,
  expires,
  email,
  price,
  passthrough,
  returnUrl,
  country
}) {
  return {
    vendor_id: paddle.vendorId,
    vendor_auth_code: paddle.vendorCode,
    title,
    expires,
    webhook_url: `${anmHost}/scores/purchase/paddle`,
    quantity_variable: 0,
    quantity: 1,
    customer_email: email,
    customer_country: country,
    return_url: returnUrl,
    passthrough,
    prices: [`USD:${price}`]
  }
}
