import GraphileUtils from 'graphile-utils'
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter'
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import PostGraphileUploadFieldPlugin from 'postgraphile-plugin-upload-field'
import PgManyToManyPlugin from '@graphile-contrib/pg-many-to-many'

import ArticleSchema from './plugins/article.plugin'
import AuthPlugin from './plugins/auth.plugin'
import AutoUpdatePlugin from './plugins/auto-update.plugin'
import ContactSchema from './plugins/contact.plugin'
import GalleryPlugin from './plugins/gallery.plugin'
import ImagePlugin from './plugins/image.plugin'
import OpenMessagePlugin from './plugins/open-message.plugin'
import LocalePlugin from './plugins/locale.plugin'
import PgManyToManyInflector from './plugins/inflectors.plugin'
import PromoPlugin from './plugins/promo.plugin'
import PurchasePlugin from './plugins/purchase.plugin'
import ScorePlugin from './plugins/score.plugin'
import UserPlugin from './plugins/user.plugin'

const { makePluginByCombiningPlugins } = GraphileUtils

export default makePluginByCombiningPlugins(
  UserPlugin,
  ImagePlugin,
  ScorePlugin,
  PurchasePlugin,
  ArticleSchema,
  ContactSchema,
  GalleryPlugin,
  AutoUpdatePlugin,
  PromoPlugin,
  AuthPlugin,
  OpenMessagePlugin,
  ConnectionFilterPlugin,
  PostGraphileUploadFieldPlugin,
  PgManyToManyPlugin,
  PgSimplifyInflectorPlugin,
  PgManyToManyInflector,
  LocalePlugin
)

export const SameGraphQLAndGraphiQLPathnameTweak = {
  'postgraphile:http:handler' (req) {
    if (
      req.url === '/graphql' &&
      req.method === 'GET' &&
      (req.headers.accept || '').indexOf('text/html') > -1
    ) {
      req.url = '/graphiql'
    }
    return req
  }
}
