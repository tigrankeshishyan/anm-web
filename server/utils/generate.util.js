/**
 * @param {number} length
 * @param {boolean} alpha
 * @description Generate random number for verification.
 */
export function code (length = 4, alpha) {
  if (length < 1) {
    throw new RangeError('Length must be at least 1')
  }

  const possible = '0123456789' + alpha ? 'abcdefghijklmnopqrstuvwxyz' : ''
  let str = ''
  for (let i = 0; i < length; i++) {
    str += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return str
}

export function discountPrice (price, percent) {
  return price - (price * (percent / 100))
}
