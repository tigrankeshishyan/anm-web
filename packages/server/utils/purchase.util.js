import * as ameria from './ameria.util'
import * as paddle from './paddle.util'

export async function purchaseLink ({
  title,
  purchaseId,
  email,
  token,
  price,
  redirect,
  userId,
  currency,
  country,
  service,
  lang
}) {
  if (service === 'ameria') {
    return ameria.initPayment({
      purchaseId,
      currency,
      amount: price,
      desc: title,
      userId,
      opaque: JSON.stringify({ token, purchaseId, redirect }),
      lang
    })
  } else if (service === 'paddle') {
    return paddle.buyLink({
      title,
      email,
      passthrough: JSON.stringify({ token, purchaseId }),
      price,
      country,
      returnUrl: redirect
    })
  }

  throw Error(`unknown payment service "${service}"`)
}

export function discountPrice (price, percent) {
  return price - (price * (percent / 100))
}
