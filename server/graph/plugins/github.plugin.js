import assert from 'assert'

import GraphileUtils from 'graphile-utils'
import { refExist, startDeploy } from '../../utils/github.util'

const { gql, makeExtendSchemaPlugin } = GraphileUtils

const allowDeploy = ['admin', 'editor']

export default makeExtendSchemaPlugin(function () {
  return {
    typeDefs: gql`
      enum EnvRef {
        prod
        stage
      }

      input DeployInput {
        """
        'heads/development', 'tags/v1' ...
        """
        ref: String!
        env: EnvRef!
      }

      type DeployPayload {
        dispatchCreated: Boolean!
      }

      extend type Mutation {
        deploy(input: DeployInput!): DeployPayload
      }
    `,
    resolvers: {
      Mutation: {
        async deploy (source, args, ctx, info) {
          const user = ctx.getUser()
          const { ref, env } = args.input

          assert.ok(user, new Error('you must be logged in to trigger deploy'))
          assert.ok(
            allowDeploy.includes(user.role),
            new Error(`only '${allowDeploy}' can trigger deploy`)
          )

          assert.ok(
            await refExist(ref),
            new Error(`ref '${ref}' can't be found`)
          )

          await startDeploy(env, ref)

          return { dispatchCreated: true }
        }
      }
    }
  }
})
