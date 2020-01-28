import assert from 'assert'

import GraphileUtils from 'graphile-utils'

import { models } from '../../sequelize'
import * as SendInBlue from '../../utils/sendinblue.util'

const { makeExtendSchemaPlugin, gql } = GraphileUtils

export default makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      enum EnumVerificationsStatus {
        PENDING
        SENT
        VERIFIED
        EXCESS
      }

      extend type Mutation {
        sendEmailCode: Boolean
        """
        Returns attempts remaining for this code, null on success.
        """
        verifyEmailCode(code: String!): Int
      }
    `,
    resolvers: {
      Mutation: {
        async sendEmailCode (query, args, ctx, resolveInfo) {
          const user = ctx.getUser()
          ensureEmail(user.email)

          const [
            verification
          ] = await models.EmailVerification.findOrCreateWithCode(
            user.id,
            user.email
          )

          const response = await SendInBlue.sendVerificationEmail(
            user.email,
            verification.code
          )
          verification.sibMessageId = response.messageId
          await verification.save()

          return true
        },
        async verifyEmailCode (query, { code }, ctx) {
          const user = ctx.getUser()
          ensureEmail(user.email)

          const success = await models.EmailVerification.verifyEmail(
            user.id,
            user.email,
            code
          )

          return success
        }
      }
    }
  }
})

function ensureEmail (email) {
  assert.ok(email, new Error("user don't have email to be verified"))
}
