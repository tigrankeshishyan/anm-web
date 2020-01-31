import assert from 'assert'
import path from 'path'

import { ExpressError } from '../../../utils/error.util'
import { models } from '../../../_sequelize'
import * as Storage from '../../../utils/storage.util'
import { scoreComingSoon, scorePreviewName } from '../../../../config'
import { Purchase } from '../../../_sequelize/models/purchase.model'
import { getPaymentDetails } from '../../../utils/ameria.util'
import { addStamp } from '../../../utils/score.util'
import { Slack } from '../../../utils/slack.util'

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
      const purchase = await models.Purchase.findOne({
        where: { userId: user.id, scoreId, status: Purchase.PAID }
      })
      assert.ok(
        purchase,
        new ExpressError('you have to purchase score to access it', 403)
      )
    }

    const score = await models.Score.findByPk(scoreId)
    if (!score.stampRight && !score.stampCenter) {
      return await res.s3Object(key)
    }

    const doc = await addStamp(
      scoreId,
      key,
      score.stampRight,
      score.stampCenter
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
    const purchase = await models.Purchase.findOne({
      where: { id: purchaseId, status: Purchase.PENDING }
    })
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

    purchase.status = Purchase.PAID
    await purchase.save()

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
    const purchase = await models.Purchase.findOne({
      where: { id: purchaseId }
    })

    if (purchase.status === Purchase.PAID) {
      return res.redirect(redirect)
    }

    assert.ok(
      purchase && purchase.status === Purchase.PENDING,
      new ExpressError(
        `the purchase ${purchaseId} with pending status don't exist`,
        404
      )
    )

    assert.ok(
      token === purchase.token,
      new ExpressError('invalid purchase token', 403)
    )

    purchase.status = Purchase.PAID
    await purchase.save()

    Slack.newPurchase(user, purchase)

    res.redirect(redirect)
  } catch (err) {
    next(err)
  }
}
