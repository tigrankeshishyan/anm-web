import GraphqlPassport from 'graphql-passport'
import postgraphile from 'postgraphile'
import dirname from 'es-dirname'

import { database, isDev, isProd } from '../../config'
import * as Storage from '../utils/storage.util'

import CustomPlugins, { SameGraphQLAndGraphiQLPathnameTweak } from './plugins'

const { buildContext } = GraphqlPassport
const { makePluginHook } = postgraphile

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

export default () =>
  postgraphile.postgraphql(database.authUrl, [database.schema], {
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
  })
