import GraphqlPassport from 'graphql-passport'
import postgraphile from 'postgraphile'
import dirname from 'es-dirname'

import { models } from '../_sequelize'

import { database, isDev } from '../../config'
import * as Storage from '../utils/storage.util'

import CustomPlugins, { SameGraphQLAndGraphiQLPathnameTweak } from './plugins'

const { buildContext } = GraphqlPassport
const { makePluginHook } = postgraphile

const pluginHook = makePluginHook([SameGraphQLAndGraphiQLPathnameTweak])

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
    exportGqlSchemaPath: isDev
      ? `${dirname()}/../../schema.graphql`
      : undefined,
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
  })
