import assert from 'assert'

import GraphileUtils from 'graphile-utils'
import uuid from 'uuid'

import {
  database,
  anmHost,
  apiPrefix,
  scoreDocumentName,
  scoreComingSoon
} from '../../config'
import {
  selectById,
  userPurchasedScore,
  insertInto,
  getPromoByCode
} from '../../utils/query.util'
import { allowOnly } from '../../utils/graphile.util'
import { discountPrice } from '../../utils/generate.util'
import {
  validateRedirect,
  isValidPromoCode,
  validateCurrency
} from '../../utils/validate.util'
import { Purchase } from '../../sequelize/models/purchase.model'
import { purchaseLink } from '../../utils/purchase.util'

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin
} = GraphileUtils

const plugin = makeWrapResolversPlugin({
  Query: {
    purchases: allowOnly(['admin'], []),
    purchasesList: allowOnly(['admin'], [])
  }
})

const schema = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      input PurchaseScoreInput {
        scoreId: Int!
        promoCode: String
        """
        ISO country code, AM for
        purchase with Ameria
        """
        country: String!
        """
        Default is USD
        """
        currency: String!
        """
        ISO language code, this will be used
        for Ameria payment page language.
        """
        lang: String
        """
        Where to redirect user after successful checkout,
        must have same domain with API.
        """
        redirect: String
      }

      extend type Query {
        """
        Generate purchase URL for specified score and current user,
        link will be valid only today. If score is already purchased
        by this user, resolver will return the score url.
        """
        scorePurchaseLink(input: PurchaseScoreInput!): String

        """
        Check if current user have purchased the score.
        """
        isScorePurchased(scoreId: Int!): Boolean
      }
    `,
    resolvers: {
      Query: {
        async isScorePurchased (source, args, ctx, info) {
          const user = ctx.getUser()
          const { pgClient } = ctx
          const { scoreId } = args

          assert.ok(user, new Error('you must be logged in to use this query'))

          const purchased = await userPurchasedScore(
            pgClient,
            user.id,
            scoreId
          )
          return !!purchased
        },
        async scorePurchaseLink (source, args, ctx, info) {
          const { pgClient } = ctx
          const { scoreId, promoCode, redirect, country } = args.input
          const currency = args.input.currency || 'USD'
          const user = ctx.getUser()

          validateRedirect(redirect)
          assert.ok(
            user,
            new Error('you have to be logged in to buy a product')
          )
          validateCurrency(currency)

          const score = await selectById(pgClient, scoreId, 'scores', {
            table: 'score_locales',
            lang: 'en'
          })
          assert.ok(score, new Error(`can't find code with id ${scoreId}`))
          assert.ok(
            score.title,
            new Error('score must have english title to be purchased')
          )
          const price = priceByCurrency(score.prices, currency)
          assert.ok(
            price,
            new Error(`score don't have valid price for ${currency} currency`)
          )

          const docKey = score.url
            ? `${score.url}/${scoreDocumentName}`
            : `scores/${scoreComingSoon}`
          const returnUrl = `${anmHost}${apiPrefix}/${docKey}`

          const purchase = await findOrCreatePurchase(
            pgClient,
            user.id,
            score.id,
            promoCode,
            price
          )
          if (purchase.status === Purchase.PAID) {
            return returnUrl
          }

          const link = await purchaseLink({
            title: score.title,
            purchaseId: purchase.id,
            email: user.email,
            token: purchase.token,
            price: purchase.discount_price || purchase.price || 0,
            redirect: redirect || returnUrl,
            userId: user.id,
            country,
            service: /AM/.test(country) ? 'ameria' : 'paddle',
            currency
          })

          return link
        }
      }
    }
  }
})

async function findOrCreatePurchase (
  pgClient,
  userId,
  scoreId,
  promoCode,
  price
) {
  const now = new Date().toISOString()
  const token = uuid.v4()

  const {
    rows: [already]
  } = await pgClient.query(
    `SELECT * FROM ${database.schema}.purchases 
WHERE user_id=$1 AND score_id=$2 AND status=$3`,
    [userId, scoreId, Purchase.PAID]
  )
  if (already) {
    return already
  }

  const discountPrice = await getPrice(pgClient, price.amount, promoCode)
  const purchase = await insertInto(pgClient, 'purchases', {
    user_id: userId,
    score_id: scoreId,
    status: Purchase.PENDING,
    promo_code: promoCode,
    token,
    price: price.amount,
    currency: price.currency,
    discount_price: discountPrice,
    created_at: now,
    updated_at: now
  })

  return purchase
}

async function getPrice (pgClient, price, promoCode) {
  if (!promoCode) {
    return null
  }

  const promo = await getPromoByCode(pgClient, promoCode)

  isValidPromoCode(promo, promoCode)

  return discountPrice(price, promo.percent)
}

function priceByCurrency (prices, currency) {
  // when getting directly from db, json column is string
  const _prices = typeof prices === 'string' ? JSON.parse(prices) : prices
  return (_prices || []).find(price => {
    return price.currency === currency
  })
}

export default makePluginByCombiningPlugins(schema, plugin)
