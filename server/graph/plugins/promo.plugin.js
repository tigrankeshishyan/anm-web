import assert from 'assert'

import GraphileUtil from 'graphile-utils'

import { byTableNameAndId } from '../../utils/graphile.util'
import { discountPrice } from '../../utils/generate.util'
import { isValidPromoCode } from '../../utils/validate.util'
import { PromoCode } from '../../_sequelize/models/promo-code.model'
import {
  selectById,
  getPromoByCode,
  insertInto,
  paramKeys
} from '../../utils/query.util'
import { database } from '../../../config'

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin
} = GraphileUtil

const wrap = makeWrapResolversPlugin({
  Mutation: {
    async createPromoCode (resolve, parent, args, ctx, info) {
      const { pgClient } = ctx
      const { promoCode } = args.input

      const code = await PromoCode.createPromoCode()
      const percent = promoCode.percent
      if (!percent) {
        throw Error(
          'promo code can be generated only with positive percentage'
        )
      }
      const now = new Date()
      const status = promoCode.status || 'active'
      await insertInto(pgClient, 'promo_codes', {
        code,
        status,
        percent,
        expires_at: promoCode.expiresAt,
        created_at: now,
        updated_at: now
      })

      return {
        data: await byTableNameAndId(code, 'promo_codes', info, 'code')
      }
    }
  }
})

const schema = makeExtendSchemaPlugin(build => {
  const { pgSql: sql } = build
  return {
    typeDefs: gql`
      enum PromoStatus {
        ACTIVE
        USED
        CANCELED
      }

      input BulkPromoInput {
        """
        How many to create, maximum 100.
        """
        count: Int!
        """
        The initial status of promo codes default is 'active'.
        """
        status: PromoStatus
        percent: Int!
        expiresAt: Datetime!
      }

      extend type Query {
        """
        Calculate discount price for score, if score
        don't have price it will return 'null'.
        """
        scoreDiscount(scoreId: Int!, code: String!): Float
      }

      extend type Mutation {
        """
        Create promo codes with same expire date and status.
        """
        createPromoBulk(input: BulkPromoInput): [PromoCode!]!
      }
    `,
    resolvers: {
      Query: {
        async scoreDiscount (parent, args, ctx) {
          const { pgClient } = ctx
          const { scoreId, code } = args

          const score = await selectById(pgClient, scoreId, 'scores')
          assert.ok(score, new Error(`can't find score with id "${scoreId}"`))

          if (!score.price) {
            return score.price
          }

          const promo = await getPromoByCode(pgClient, code)
          isValidPromoCode(promo, code)

          return discountPrice(score.price, promo.percent)
        }
      },
      Mutation: {
        async createPromoBulk (parent, args, ctx, info) {
          const { pgClient } = ctx
          const { graphile } = info
          const { count, status = 'active', percent, expiresAt } = args.input
          validateBulkInput(args.input)

          const now = new Date().toISOString()
          const promos = await PromoCode.createPromoCodes(count)

          const start = `INSERT INTO ${
            database.schema
          }.promo_codes(${promoColumns.join(', ')}) VALUES`

          const paramsKeyStr = paramKeys(promos.length, promoColumns.length)
          const query = `${start} \n${paramsKeyStr}`

          const makeRow = (all, promo) => [
            ...all,
            promo,
            status,
            percent,
            expiresAt,
            now,
            now
          ]

          await pgClient.query(query, promos.reduce(makeRow, []))

          return graphile.selectGraphQLResultFromTable(
            sql.fragment`${sql.identifier(database.schema, 'promo_codes')}`,
            (tableAlias, queryBuilder) => {
              const where = sql.fragment`${queryBuilder.getTableAlias()}.code = ANY(${sql.value(
                promos
              )})`
              queryBuilder.where(where)
            }
          )
        }
      }
    }
  }
})

const promoColumns = [
  'code',
  'status',
  'percent',
  'expires_at',
  'created_at',
  'updated_at'
]

function validateBulkInput (input) {
  const { count, percent } = input
  assert.ok(
    count > 0 && count <= 100,
    new Error('"count" must be in range 1-100')
  )
  assert.ok(
    percent > 0 && percent <= 100,
    new Error('"percent" must be in range 1-100')
  )
}

export default makePluginByCombiningPlugins(wrap, schema)
