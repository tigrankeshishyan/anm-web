import GraphileUtils from 'graphile-utils'

import {
  anmHost,
  apiPrefix,
  scoreDocumentName,
  database,
  scorePreviewName
} from '../../config'
import {
  deleteObject,
  headObject,
  SCORE_PREFIX,
  uploadScore,
  uploadScorePreview
} from '../../utils/storage.util'
import { deleteFrom, insertInto } from '../../utils/query.util'
import { validatePrices } from '../../utils/validate.util'
import { allowOnly } from '../../utils/graphile.util'

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin
} = GraphileUtils

const plugin = makeWrapResolversPlugin({
  Score: {
    purchases: allowOnly(['admin'], []),
    purchasesList: allowOnly(['admin'], []),
    async url (resolve) {
      const url = await resolve()
      return url ? `${anmHost}${apiPrefix}/${url}/${scoreDocumentName}` : null
    },
    preview: {
      requires: {
        siblingColumns: [{ column: 'id', alias: '$id' }]
      },
      async resolve (resolve, parent) {
        const key = `${SCORE_PREFIX}/${parent.$id}/${scorePreviewName}`
        try {
          const head = await headObject(key)
          const { opts } = head.Metadata
          return {
            url: `${anmHost}${apiPrefix}/${key}`,
            options: JSON.parse(opts)
          }
        } catch (err) {
          return null
        }
      }
    }
  },
  Mutation: {
    createScore: {
      requires: {
        childColumns: [
          { column: 'id', alias: '$id' },
          { column: 'url', alias: '$url' }
        ]
      },
      resolve: createUpdateScore
    },
    updateScore: {
      requires: {
        childColumns: [
          { column: 'id', alias: '$id' },
          { column: 'url', alias: '$url' }
        ]
      },
      resolve: createUpdateScore
    },
    deleteScore: {
      requires: { childColumns: [{ column: 'url', alias: '$url' }] },
      async resolve (resolve) {
        const resolved = await resolve()
        const url = resolved.data.$url
        await deleteObject(
          `${url}/${scoreDocumentName}`,
          `${url}/${scorePreviewName}`
        )
        return resolved
      }
    }
  }
})

async function createUpdateScore (resolve, parent, args, ctx, info) {
  const resolved = await resolve()
  const { pgClient } = ctx
  const patch = args.input.patch || args.input.score
  const { previewOptions: opts, instruments, prices } = args.input

  const scoreId = resolved.data.$id
  const docUrl = resolved.data.$url

  if (prices) validatePrices(prices)

  // when new document is uploaded
  if (patch.url) {
    const upload = await patch.url
    const url = await uploadScore(upload, scoreId)
    await pgClient.query(
      `UPDATE ${database.schema}.scores SET url=$1 WHERE id=$2`,
      [url, scoreId]
    )
    resolved.data['@score'].url = url
  }

  // when preview options provided
  if (opts) {
    if (!docUrl) {
      throw Error('there is no document uploaded for this record')
    }
    if (opts && opts.pages) {
      if (!opts.pages.length) {
        throw Error('"previewOptions.pages" can\'t be empty')
      }

      await uploadScorePreview(scoreId, opts)
    }
  }

  if (instruments) {
    await deleteFrom(pgClient, {
      table: 'score_instruments',
      column: 'score_id',
      value: scoreId
    })
    for (const id of instruments) {
      const data = { score_id: scoreId, instrument_id: id }
      await insertInto(pgClient, 'score_instruments', data, false)
    }
  }

  return resolved
}

const schema = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      type ScaleFactor {
        factor: Float!
        position: String
      }

      type PreviewOptions {
        pages: [String!]
        watermarkPages: [String!]
        scaleFactor: Float
        scalePosition: String
        rotation: Float
        opacity: Float
      }

      type Preview {
        url: String
        options: PreviewOptions
      }

      extend type Score {
        preview: Preview
      }

      input Price {
        value: BigFloat!
        currency: String!
      }

      """
      This options must be provided to create
      preview document, for more details see
      the PreviewOptions docs.
      """
      input CreatePreviewOptions {
        """
        Pages to generate preview, for examples look
        in pdfcpu docs https://pdfcpu.io/pages/pages_remove.
        For example to add 2 and 3 pages in preview pass ["-2", "4-"]
        this will remove page 1 and all after 4 from preview.
        """
        pages: [String!]
        """
        On which pages add watermark, Ex.
        ['2-'] after first page
        ['2', '5-'] on second and after 4-th page
        """
        watermarkPages: [String!]
        """
        Scale 0.0 < i <= 1.0
        """
        scaleFactor: Float
        """
        abs or rel
        """
        scalePosition: String
        """
        Rotation degree -180.0 <= i <= 180.0
        """
        rotation: Float
        """
        Opacity from 0.0 to 1.0
        """
        opacity: Float
      }

      extend input UpdateScoreInput {
        """
        Instrument IDs to attach to this score.
        """
        instruments: [Int!]

        prices: [Price!]
        """
        To generate preview use this options.
        """
        previewOptions: CreatePreviewOptions
      }

      extend input CreateScoreInput {
        """
        Instrument IDs to attach to this score.
        """
        instruments: [Int!]

        prices: [Price!]
        """
        To generate preview use this options.
        """
        previewOptions: CreatePreviewOptions
      }
    `
  }
})

export default makePluginByCombiningPlugins(schema, plugin)
