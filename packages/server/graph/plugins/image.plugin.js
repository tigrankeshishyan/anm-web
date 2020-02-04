import GraphileUtils from 'graphile-utils'

import { anmHost } from '../../../config'
import { deleteImage } from '../../utils/storage.util'
import { Slack } from '../../utils/slack.util'

const { makeWrapResolversPlugin } = GraphileUtils

export default makeWrapResolversPlugin({
  Image: {
    async url (resolve) {
      return `${anmHost}/${await resolve()}`
    }
  },
  Mutation: {
    deleteImage: {
      requires: { childColumns: [{ alias: 'url', column: 'url' }] },
      async resolve (resolve) {
        const resolved = await resolve()

        const { url } = resolved.data

        await deleteImage(url).catch(err => {
          Slack.devMessage(`failed to remove image from s3 ${url}. ${err.message}`)
        })

        return resolved
      }
    }
  }
})
