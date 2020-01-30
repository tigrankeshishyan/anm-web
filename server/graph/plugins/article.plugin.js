import GraphileUtils from 'graphile-utils'

import { byTableNameAndId } from '../../utils/graphile.util'
import * as Storage from '../../utils/storage.util'
import { database } from '../../config'
import { deleteFrom, insertInto } from '../../utils/query.util'

const {
  makeExtendSchemaPlugin,
  makeWrapResolversPlugin,
  makePluginByCombiningPlugins,
  gql
} = GraphileUtils

const schema = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      extend input CreateArticleInput {
        genres: [Int!]
        tags: [Int!]
        images: [Int!]
        createImages: [ImageInput]
      }

      extend input UpdateArticleInput {
        genres: [Int!]
        tags: [Int!]
        images: [Int!]
        createImages: [ImageInput]
      }
    `
  }
})

const plugin = makeWrapResolversPlugin({
  Mutation: {
    createArticle: {
      requires: {
        childColumns: [{ column: 'id', alias: '$article_id' }]
      },
      resolve: mutateArticle
    },
    updateArticle: {
      requires: {
        childColumns: [{ column: 'id', alias: '$article_id' }]
      },
      resolve: mutateArticle
    }
  }
})

export default makePluginByCombiningPlugins(schema, plugin)

async function mutateArticle (resolve, parent, args, ctx, info) {
  const { input } = args
  const { pgClient } = ctx
  const user = ctx.getUser()
  const { publishedAt } = input.article || input.patch
  const { genres, tags, images, createImages } = input

  const resolved = await resolve()
  const _id = resolved.data.$article_id

  const articlesTable = `${database.schema}.articles`

  if (publishedAt !== undefined) {
    await pgClient.query(
      `UPDATE ${articlesTable} SET published_at=$1 WHERE id=${_id}`,
      [publishedAt]
    )
  }

  if (info.fieldName === 'createArticle') {
    await pgClient.query(
      `UPDATE ${articlesTable} SET author_id=${user.id} WHERE id=${_id}`
    )
  } else {
    await pgClient.query(
      `UPDATE ${articlesTable} SET updater_id=${user.id} WHERE id=${_id}`
    )
  }

  if (genres) {
    await deleteFrom(pgClient, {
      table: 'article_genres',
      column: 'article_id',
      value: _id
    })
    for (const id of genres) {
      const data = { article_id: _id, genre_id: id }
      await insertInto(pgClient, 'article_genres', data)
    }
  }

  if (tags) {
    await deleteFrom(pgClient, {
      table: 'article_tags',
      column: 'article_id',
      value: _id
    })
    for (const id of tags) {
      const data = { article_id: _id, tag_id: id }
      await insertInto(pgClient, 'article_tags', data)
    }
  }

  if (images) {
    await deleteFrom(pgClient, {
      table: 'article_images',
      column: 'article_id',
      value: _id
    })
    for (const id of images) {
      const data = { article_id: _id, image_id: id }
      await insertInto(pgClient, 'article_images', data)
    }
  }

  if (Array.isArray(createImages) && createImages.length) {
    createImages.forEach(validateImageInput)

    await Promise.all(
      createImages.map(async img => {
        const url = await Storage.uploadImage(await img.url)

        const imgData = { url, caption: img.caption, description: img.description }
        const row = await insertInto(pgClient, 'images', imgData)
        await insertInto(pgClient, 'article_images', { article_id: _id, image_id: row.id })
      })
    )
  }

  return {
    data: await byTableNameAndId(_id, 'articles', info)
  }
}

function validateImageInput (input) {
  if (typeof input.url.then === 'function') {
    return
  }

  throw Error(`invalid input for createImages ${JSON.stringify(input)}`)
}
