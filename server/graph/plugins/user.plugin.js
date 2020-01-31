import assert from 'assert'

import GraphileUtils from 'graphile-utils'

import { byTableNameAndId, allowOnly } from '../../utils/graphile.util'
import {
  createContact,
  sendWelcome,
  sendResetLink
} from '../../utils/sendinblue.util'
import { database, anmHost } from '../../../config'
import { passwordMaker } from '../../utils/hash.util'
import { ROLE, ResetPassword, User } from '../../_sequelize/models/user.model'
import * as Storage from '../../utils/storage.util'
import { Slack } from '../../utils/slack.util'

const allowed = Object.values(ROLE)

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin
} = GraphileUtils

const plugin = makeWrapResolversPlugin({
  User: {
    purchases: allowOnly(['admin'], []),
    purchasesList: allowOnly(['admin'], []),
    async password () {
      return ''
    }
  },
  Mutation: {
    createUser: {
      requires: {
        childColumns: [
          { column: 'id', alias: '$id' },
          { column: 'first_name', alias: '$firstName' },
          { column: 'last_name', alias: '$lastName' },
          { column: 'email', alias: '$email' }
        ]
      },
      async resolve (resolve, source, args, ctx) {
        const propName = 'user'
        if (args.input[propName].password) {
          args.input[propName].password = await passwordMaker(
            args.input[propName].password
          )
        }
        const resolved = await resolve()
        const data = resolved.data
        if (data.$email) {
          await createContact({
            userId: data.$id,
            firstName: data.$firstName,
            lastName: data.$lastName,
            email: data.$email
          })
          const { locale } = ctx.req
          await sendWelcome(data.$email, locale)
        }

        Slack.newUser({
          id: data.$id,
          email: data.$email,
          firstName: data.$firstName,
          lastName: data.$lastName
        })

        return resolved
      }
    }
  }
})

const schema = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      extend type User {
        """
        The verification status. Will be null,
        if there is no verification attempts.
        """
        emailVerificationStatus: String
      }

      input PasswordPatch {
        old: String!
        new: String!
      }

      input CurrentUserPatch {
        firstName: String
        lastName: String
        email: String
        password: PasswordPatch
        avatar: Upload
      }

      type UpdateCurrentUserPayload {
        currentUser: User! @pgField
        query: Query
      }

      type LoginPayload {
        """
        0 - success

        1 - invalid credentials

        2 - try facebook
        """
        errorCode: Int!
        """
        Message about why login failed, null on success.
        """
        message: String
      }

      input UpdateUserStatusInput {
        userId: Int!
        """
        0 active, 1 blocked
        """
        status: Int!
      }

      extend type Query {
        currentUser: User
      }

      extend type Mutation {
        login(email: String!, password: String!): LoginPayload!
        logout: Boolean
        changeUserRole(userId: Int!, role: String!): Boolean
        updateCurrentUser(input: CurrentUserPatch!): UpdateCurrentUserPayload
        """
        'true' if user have be removed, 'false' if password was incorrect
        """
        deleteCurrentUser(password: String!): Boolean!
        updateUserStatus(input: UpdateUserStatusInput!): Boolean!
      }
    `,
    resolvers: {
      User: {
        async emailVerificationStatus (source, args, ctx) {
          const user = ctx.getUser()
          const { models } = ctx
          if (!user.email) return null

          const verification = await models.EmailVerification.byUserEmail(
            user.id,
            user.email
          )

          return verification && verification.status.toUpperCase()
        }
      },
      Query: {
        async currentUser (_query, args, ctx, resolveInfo) {
          const user = ctx.getUser()
          if (!user) return null

          return byTableNameAndId(user.id, 'users', resolveInfo)
        }
      },
      Mutation: {
        async login (query, args, ctx) {
          const { email, password } = args

          const { user, info } = await ctx.authenticate('graphql-local', {
            username: email,
            password: password
          })

          if (user) {
            await ctx.login(user)
            return { message: null, errorCode: 0 }
          }

          // this will return message from info
          return info
        },

        async logout (query, args, ctx) {
          if (ctx.isAuthenticated()) {
            await ctx.logout()
            return true
          } else {
            return false
          }
        },

        async changeUserRole (query, args, ctx, info) {
          const { pgClient } = ctx
          const user = ctx.getUser()

          if (user.role !== 'admin') {
            throw Error('only admins can change role')
          }

          if (!allowed.includes(args.role)) {
            throw Error(
              `invalid role "${args.role}", must be one of [${allowed.join()}]`
            )
          }

          await pgClient.query(
            `UPDATE ${database.schema}.users SET role=$1 WHERE id=$2`,
            [args.role, args.userId]
          )

          return true
        },

        async updateCurrentUser (source, args, ctx, info) {
          const { pgClient } = ctx
          const user = ctx.getUser()
          const patch = args.input

          if (patch.password) {
            if (!(await user.comparePassword(patch.password.old))) {
              throw Error('invalid current password')
            }
            patch.password.new = await passwordMaker(patch.password.new)
          }

          const fragments = []

          if (patch.firstName) {
            fragments.push(`first_name='${patch.firstName}'`)
          }
          if (patch.lastName) fragments.push(`last_name='${patch.lastName}'`)
          if (patch.email) fragments.push(`email='${patch.email}'`)
          if (patch.password && patch.password.new) {
            fragments.push(`password='${patch.password.new}'`)
          }
          if (patch.avatar) {
            const upload = await patch.avatar
            const url = await Storage.uploadAvatar(upload, args, ctx)
            fragments.push(`avatar='${url}'`)
          }

          const query =
            `UPDATE ${database.schema}.users SET ` +
            fragments.join(', ') +
            ` WHERE id=${user.id}`

          await pgClient.query(query)

          return {
            data: await byTableNameAndId(user.id, 'users', info)
          }
        },

        async deleteCurrentUser (source, args, ctx, info) {
          const { password } = args
          const { pgClient } = ctx
          const user = ctx.getUser()
          if (!(await user.comparePassword(password))) {
            return false
          }

          if (ctx.isAuthenticated()) {
            await ctx.logout()
          }

          await pgClient.query(
            `DELETE FROM ${database.schema}.users WHERE id=${user.id}`
          )

          return true
        },

        async updateUserStatus (source, args, ctx, info) {
          const { pgClient } = ctx
          const user = ctx.getUser()

          const { userId, status } = args.input

          assert.ok(
            user.role !== 'admin',
            new Error('you are not allowed to block user')
          )

          await pgClient.query(
            `UPDATE ${database.schema}.users SET status=$1 WHERE id=$2`,
            [status, userId]
          )

          return true
        }
      }
    }
  }
})

const ResetPasswordPlugin = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      input ForgotPasswordInput {
        email: String!
      }

      type ForgetPasswordPayload {
        "false if not user with email"
        success: Boolean!
      }

      input ResetPasswordInput {
        token: String!
        newPassword: String!
      }

      type ResetPasswordPayload {
        "false if token is missing or expired"
        success: Boolean!
      }

      extend type Mutation {
        forgetPassword(input: ForgotPasswordInput!): ForgetPasswordPayload!
        resetPassword(input: ResetPasswordInput!): ResetPasswordPayload!
      }
    `,
    resolvers: {
      Mutation: {
        async forgetPassword (parent, args, ctx) {
          const { email } = args.input
          const { locale } = ctx.req

          const count = await User.count({ where: { email } })
          if (count === 0) {
            return { success: false }
          }

          const reset = await ResetPassword.create({ email })
          const link = `${anmHost}/${locale}/reset-password/${reset.id}`
          await sendResetLink(email, link, locale)

          return { success: true }
        },
        async resetPassword (parent, args, ctx) {
          const { token, newPassword } = args.input

          const reset = await ResetPassword.findAndIncrement(token)

          if (!reset) {
            return { success: false }
          }

          const passwordHash = await passwordMaker(newPassword)

          await User.update(
            { password: passwordHash },
            { where: { email: reset.email } }
          )

          return { success: true }
        }
      }
    }
  }
})

export default makePluginByCombiningPlugins(
  schema,
  plugin,
  ResetPasswordPlugin
)
