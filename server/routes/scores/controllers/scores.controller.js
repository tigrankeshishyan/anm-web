import assert from 'assert'
import path from 'path'

import { ExpressError } from '../../../utils/error.util'
import * as Storage from '../../../utils/storage.util'
import { scoreComingSoon, scorePreviewName } from '../../../../config'
import { getPaymentDetails } from '../../../utils/ameria.util'
import { addStamp } from '../../../utils/score.util'
import { Slack } from '../../../utils/slack.util'
import pgClient from '../../../pgClient'

const publicScores = [scoreComingSoon, scorePreviewName]

const alwaysAllow = ['admin', 'editor']

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export async function getScore (req, res, next) {
  try {
    const key = `${Storage.SCORE_PREFIX}${req.path}`
    const basename = path.basename(key)
    const scoreId = parseInt(key.match(/scores\/(\d+)\/.*/)[1])
    const { user } = req

    if (publicScores.includes(basename)) {
      return await res.s3Object(key)
    }

    assert.ok(
      user,
      new ExpressError('you have to sign in to access document', 403)
    )
    assert.ok(scoreId, new Error("can't detect score id for provided key"))

    if (!alwaysAllow.includes(user.role)) {
      const {
        rows: [purchase]
      } = await pgClient.query(
        'select * from app_public.purchases where user_id=$1 and score_id=$2 and status=$3',
        [user.id, scoreId, 'paid']
      )
      assert.ok(
        purchase,
        new ExpressError('you have to purchase score to access it', 403)
      )
    }

    const {
      rows: [score]
    } = await pgClient.query('select * from app_public.scores where id=$1', [
      scoreId
    ])
    if (!score.stamp_right && !score.stamp_center) {
      return await res.s3Object(key)
    }

    const doc = await addStamp(
      scoreId,
      key,
      score.stamp_right,
      score.stamp_center
    )

    doc.pipe(res)
  } catch (err) {
    next(err)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export async function purchaseFromPaddle (req, res, next) {
  try {
    const { user } = req
    const { purchaseId, token } = JSON.parse(req.body.passthrough || '{}')

    assert.ok(
      purchaseId && token,
      new ExpressError("missing 'purchaseId' or 'token'", 400)
    )
    const {
      rows: [purchase]
    } = await pgClient.query('select * from app_public.purchases where id=$1', [
      purchaseId
    ])
    assert.ok(
      purchase,
      new ExpressError(
        `the purchase ${purchaseId} with pending status don't exist`,
        404
      )
    )

    if (token !== purchase.token) {
      throw new ExpressError('invalid purchase token', 403)
    }

    await pgClient.query(
      'update app_public.purchases set status=$1 where id=$1',
      ['paid', purchaseId]
    )

    Slack.newPurchase(user, purchase)

    res.json({ data: { purchaseId: purchase.id } })
  } catch (err) {
    next(err)
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
export async function purchaseFromAmeria (req, res, next) {
  try {
    const { user } = req
    const { paymentID, opaque } = req.query

    const { token, purchaseId, redirect } = JSON.parse(opaque)

    const details = await getPaymentDetails(paymentID)
    assert.ok(
      details.ResponseCode === '00',
      new ExpressError(
        `purchase details ResponseCode is ${details.ResponseCode}`
      )
    )
    assert.ok(
      purchaseId && token,
      new ExpressError("missing 'purchaseId' or 'token'", 400)
    )
    const {
      rows: [purchase]
    } = await pgClient.query('select * from app_public.purchases where id=$1', [
      purchaseId
    ])

    if (purchase.status === 'paid') {
      return res.redirect(redirect)
    }

    assert.ok(
      purchase && purchase.status === 'pending',
      new ExpressError(
        `the purchase ${purchaseId} with pending status don't exist`,
        404
      )
    )

    assert.ok(
      token === purchase.token,
      new ExpressError('invalid purchase token', 403)
    )

    await pgClient.query(
      'update app_public.purchases set status=$1 where id=$2',
      ['paid', purchaseId]
    )

    Slack.newPurchase(user, purchase)

    res.redirect(redirect)
  } catch (err) {
    next(err)
  }
}
