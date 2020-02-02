import assert from 'assert'

import GraphileUtil from 'graphile-utils'

import { discountPrice } from '../../utils/generate.util'
import { isValidPromoCode } from '../../utils/validate.util'

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins
} = GraphileUtil

const schema = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      extend type Query {
        """
        Calculate discount price for score, if score
        don't have price it will return 'null'.
        """
        scoreDiscount(scoreId: Int!, code: String!): Float
      }
    `,
    resolvers: {
      Query: {
        async scoreDiscount (parent, args, ctx) {
          const { pgClient } = ctx
          const { scoreId, code } = args

          const {
            rows: [score]
          } = await pgClient.query(
            'select * from app_public.scores where id=$1',
            [scoreId]
          )
          assert.ok(score, new Error(`can't find score with id "${scoreId}"`))

          if (!score.price) {
            return score.price
          }

          const { rows: [promo] } = await pgClient.query(
            'select * from app_public.promo_codes where code=1$1',
            [code]
          )

          isValidPromoCode(promo, code)

          return discountPrice(score.price, promo.percent)
        }
      }
    }
  }
})

export default makePluginByCombiningPlugins(schema)
