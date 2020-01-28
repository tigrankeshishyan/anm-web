import GraphileUtils from 'graphile-utils'

import { anmHost, apiPrefix } from '../../config'

const { makeWrapResolversPlugin } = GraphileUtils

export default makeWrapResolversPlugin({
  Image: {
    async url (resolve) {
      return `${anmHost}${apiPrefix}/${await resolve()}`
    }
  }
})
