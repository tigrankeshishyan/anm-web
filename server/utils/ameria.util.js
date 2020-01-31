import assert from 'assert'

import axios from 'axios'

import { ameria, anmHost } from '../../config'
import { validateCurrency } from './validate.util'

const credentials = {
  ClientID: ameria.clientId,
  Username: ameria.username,
  Password: ameria.password
}

const apiUrl = 'https://services.ameriabank.am/VPOS'

export async function initPayment ({
  purchaseId,
  currency = 'AMD',
  amount,
  desc,
  userId,
  opaque,
  lang
}) {
  validateCurrency(currency)

  const body = {
    ...credentials,
    OrderID: purchaseId,
    Currency: currency,
    Amount: amount,
    Description: desc,
    BackURL: `${anmHost}/scores/purchase/ameria`,
    CardHolderID: userId,
    Opaque: opaque
  }

  const respond = await axios.post(`${apiUrl}/api/VPOS/InitPayment`, body)

  const { PaymentID, ResponseCode, ResponseMessage } = respond.data

  assert.ok(
    ResponseCode === 1,
    new Error(`${ResponseCode}: ${ResponseMessage}`)
  )

  return `${apiUrl}/Payments/Pay?id=${PaymentID}&amp;lang=${lang || 'en'}`
}

export async function getPaymentDetails (paymentId) {
  const respond = await axios.post(`${apiUrl}/api/VPOS/GetPaymentDetails`, {
    PaymentID: paymentId + '',
    Username: credentials.Username,
    Password: credentials.Password
  })

  return respond.data
}
