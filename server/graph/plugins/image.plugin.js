import GraphileUtils from 'graphile-utils'

import { anmHost } from '../../../config'

const { makeWrapResolversPlugin } = GraphileUtils

export default makeWrapResolversPlugin({
  Image: {
    async url (resolve) {
      return `${anmHost}/${await resolve()}`
    }
  }
})
