import GraphileUtils from 'graphile-utils'
import { database } from '../../../config'

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin
} = GraphileUtils

const schema = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs: gql`
      extend input CreateArticleGalleryInput {
        articleId: Int
      }

      extend input UpdateArticleGalleryPatch {
        articleId: Int
      }
    `
  }
})

const plugin = makeWrapResolversPlugin({
  Mutation: {
    createArticleGallery: {
      requires: {
        childColumns: [{ column: 'id', alias: '$gallery_id' }]
      },
      resolve: setArticleRelation
    },
    updateArticleGallery: {
      requires: {
        childColumns: [{ column: 'id', alias: '$gallery_id' }]
      },
      resolve: setArticleRelation
    }
  }
})

export default makePluginByCombiningPlugins(schema, plugin)

async function setArticleRelation (resolve, source, args, context, info) {
  const { articleId } = args.input || args.patch
  const { pgClient } = context

  const resolved = await resolve()

  if (articleId) {
    const _id = resolved.data.$gallery_id
    await pgClient.query(`UPDATE ${database.schema}.articles SET gallery_id=${_id} WHERE id=${articleId}`)
  }

  return resolved
}
