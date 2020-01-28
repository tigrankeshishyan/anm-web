import GraphqlPassport from 'graphql-passport'
import postgraphile from 'postgraphile'

import { models } from '../sequelize'

import { database, apiPrefix } from '../config'
import * as Storage from '../utils/storage.util'

import CustomPlugins, { SameGraphQLAndGraphiQLPathnameTweak } from './plugins'

const { buildContext } = GraphqlPassport
const { makePluginHook } = postgraphile

const pluginHook = makePluginHook([SameGraphQLAndGraphiQLPathnameTweak])

export default () => postgraphile.postgraphql(
  database.connectionString,
  [database.schema, database.schemaLocale],
  {
    ownerConnectionString: database.connectionString,
    appendPlugins: [CustomPlugins],
    pluginHook,
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
    dynamicJson: true,
    simpleCollections: 'both',
    externalUrlBase: apiPrefix,
    bodySizeLimit: '50mb',
    additionalGraphQLContextFromRequest (request) {
      return buildContext({
        // for graphql-passport use name 'req'
        req: request,
        models
      })
    },
    graphileBuildOptions: {
      pgOmitListSuffix: false,
      nestedMutationsSimpleFieldNames: true,
      connectionFilterRelations: true,
      localesSchema: database.schemaLocale,
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
        {
          match: all => all.column === 'url' && all.table === 'scores'
        },
        {
          match: all =>
            all.column === 'attached_file' && all.table === 'contact_messages',
          resolve: Storage.uploadContactAttachment
        }
      ]
    }
  }
)
