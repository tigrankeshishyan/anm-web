import Sequelize from 'sequelize'
import localize from '../utils/localize.util'

import {
  Article,
  ArticleGallery,
  ArticleGalleryImages,
  ArticleGenre,
  ArticleImage,
  ArticleTag
} from './models/article.model'
import { Composition } from './models/composition.model'
import { ContactMessage } from './models/contact-message.model'
import { Document } from './models/document.model'
import { EmailVerification } from './models/email-verification.model'
import { Genre } from './models/genre.model'
import {
  Group,
  GroupMusician,
  GroupPlaylist,
  GroupImage
} from './models/group.model'
import { Instrument } from './models/instrument.model'
import { Media } from './models/media.model'
import {
  Musician,
  MusicianProfession,
  MusicianGenre,
  MusicianPlaylist,
  MusicianImage,
  MusicianTag,
  MusicianComposition
} from './models/musician.model'
import { Image } from './models/image.model'
import { Language } from './models/language.model'
import { PageSection } from './models/page-section.model'
import { Playlist, PlaylistMedia } from './models/playlist.model'
import { Profession } from './models/profession.model'
import { PromoCode } from './models/promo-code.model'
import { Purchase } from './models/purchase.model'
import { Score, ScoreInstruments } from './models/score.model'
import { Session } from './models/session.model'
import { Tag } from './models/tag.model'
import { User, ResetPassword } from './models/user.model'
import * as config from '../config'

const { database } = config

/**
 * @type {Sequelize.Sequelize}
 */
export const sequelize = new Sequelize(database.connectionString, {
  define: {
    timestamps: true,
    underscored: true
  },
  databaseVersion: '11.0.0',
  schema: database.schema,
  logging: null
})

sequelize.addHook('afterDefine', model => {
  if (model.rawAttributes.id) {
    model.rawAttributes.id.comment = '@omit create,update'
  }

  if (model.rawAttributes.createdAt) {
    model.rawAttributes.createdAt.allowNull = true
    model.rawAttributes.createdAt.comment =
      "This field is controlled under the hood, don't use it."
  }

  if (model.rawAttributes.updatedAt) {
    model.rawAttributes.updatedAt.allowNull = true
    model.rawAttributes.updatedAt.comment =
      "This field is controlled under the hood, don't use it."
  }
})

/**
 * @type {Object<string, typeof Sequelize.Model>}
 */
export const models = sequelize.models

const imports = [
  Article,
  ArticleGallery,
  ArticleGalleryImages,
  ArticleGenre,
  ArticleImage,
  ArticleTag,
  Composition,
  ContactMessage,
  Document,
  EmailVerification,
  Genre,
  Group,
  GroupImage,
  GroupMusician,
  GroupPlaylist,
  Image,
  Instrument,
  Language,
  Media,
  Musician,
  MusicianComposition,
  MusicianGenre,
  MusicianImage,
  MusicianPlaylist,
  MusicianProfession,
  MusicianTag,
  PageSection,
  Playlist,
  PlaylistMedia,
  Profession,
  PromoCode,
  Purchase,
  ResetPassword,
  Score,
  ScoreInstruments,
  Session,
  Tag,
  User
]

for (const model of imports) {
  model.init(sequelize)
}

for (const model of imports) {
  if ('associate' in model) {
    model.associate(sequelize.models)
  }
}

for (const model of imports) {
  localize(model)
}

/**
 * @param {Object} options will be passed to sync(options)
 */
export async function init (options) {
  await sequelize.createSchema(database.schema)
  await sequelize.createSchema(database.schemaLocale)
  await sequelize.sync(options)
}
