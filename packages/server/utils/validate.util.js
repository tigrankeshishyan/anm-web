import assert from 'assert';

import moment from 'moment';

import { anmHost, currencies } from '../config';

export function isUploadPDF (file) {
  if (file.mimetype !== 'application/pdf') {
    throw Error('upload item can only be of type pdf');
  }
}

export function isValidPromoCode (promo, code) {
  if (!promo) {
    throw Error(`can't find provided promo code "${code}"`);
  }

  if (promo.status !== 'active') {
    throw Error(`promo code "${code}" is not active`);
  }

  const exp = moment(promo.expires_at);
  if (moment().isAfter(exp)) {
    throw Error(`promo code has expired at ${exp.toISOString()}`);
  }
}

/**
 * @param {string} url
 *
 * @throws If URL provided and it don't start
 * with config.anmHost, function will throw error.
 */
export function validateRedirect (url) {
  if (url) {
    assert.ok(
      url.startsWith(anmHost),
      new Error(`redirect URL must start with ${anmHost}`)
    );
  }
}

export function validateCurrency (currency) {
  const valid = !!currencies.some(valid => valid === currency);
  assert.ok(valid, new Error(`unknown currency ${currency}`));
}

export function validateAmount (amount) {
  assert.ok(
    parseFloat(amount) >= 0,
    new Error(`amount must be a number, got ${amount}`)
  );
}

export function validatePrice (price) {
  assert.ok(price, new Error(`price must non empty object, got ${price}`));

  validateCurrency(price.currency);
  validateAmount(price.amount);
}

export function validatePrices (prices) {
  prices.forEach(validatePrice);
}
