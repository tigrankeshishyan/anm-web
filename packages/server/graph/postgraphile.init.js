import Apollo from 'apollo-server-express'
import GraphqlPassport from 'graphql-passport'
import postgraphile from 'postgraphile'
import PostgraphileApollo from 'postgraphile-apollo-server'
import dirname from 'es-dirname'
import pg from 'pg'

import { database, isDev, apolloEngineKey, env } from '../../config'
import * as Storage from '../utils/storage.util'
import CustomPlugins, { SameGraphQLAndGraphiQLPathnameTweak } from './plugins'

const { makeSchemaAndPlugin } = PostgraphileApollo

const { buildContext } = GraphqlPassport
const { makePluginHook } = postgraphile
const { ApolloServer } = Apollo

const pluginHook = makePluginHook([SameGraphQLAndGraphiQLPathnameTweak])

async function pgSettings (req) {
  const { user } = req

  return {
    role: process.env.DATABASE_VISITOR,
    'user.id': user && user.id
  }
}

const graphileBuildOptions = {
  pgOmitListSuffix: false,
  nestedMutationsSimpleFieldNames: true,
  connectionFilterRelations: true,
  localesSchema: database.schema,
  uploadFieldDefinitions: [
    {
      match: all => all.column === 'avatar' && all.table === 'users',
      resolve: Storage.uploadAvatar
    },
    {
      match: all => all.column === 'url' && all.table === 'images',
      resolve: Storage.uploadImage
    },
    {
      match: all => all.column === 'url' && all.table === 'media',
      resolve: Storage.uploadAudio
    },
    { match: all => all.column === 'url' && all.table === 'scores' },
    {
      match: all =>
        all.column === 'attached_file' && all.table === 'open_messages',
      resolve: Storage.uploadOpenMessageAttachment
    }
  ]
}

/**
 * @param {import('express')} app
 */
const install = async app => {
  const pgPool = new pg.Pool({
    connectionString: database.authUrl
  })

  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    [database.schema],
    {
      ownerConnectionString: database.url,
      appendPlugins: [CustomPlugins],
      pluginHook,
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      dynamicJson: true,
      simpleCollections: 'both',
      bodySizeLimit: '50mb',
      sortExport: true,
      pgSettings,
      graphileBuildOptions,
      exportGqlSchemaPath: isDev
        ? `${dirname()}/../../../schema.graphql`
        : undefined,
      additionalGraphQLContextFromRequest (request) {
        return buildContext({
          // for graphql-passport use name 'req'
          req: request
        })
      }
    }
  )

  const server = new ApolloServer({
    schema,
    plugins: [plugin],
    engine: {
      apiKey: apolloEngineKey,
      schemaTag: env
    },
    context: ({ req, res }) => buildContext({ req, res })
  })

  server.applyMiddleware({ app })
}

export default install
