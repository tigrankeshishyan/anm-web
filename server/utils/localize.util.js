import Sequelize from 'sequelize'

import * as config from '../../config'

const isLocalized = attr => attr.comment && attr.comment.includes('@localize')

/**
 * @param {typeof import('sequelize').Model} model
 */
export default function localize (model) {
  const { sequelize } = model
  const { Language } = sequelize.models
  const localizeModel = Object.values(model.rawAttributes).some(isLocalized)
  if (!localizeModel) return

  const attrs = {
    sourceId: {
      type: model.rawAttributes.id.type,
      allowNull: false,
      primaryKey: true
    },
    lang: {
      type: Sequelize.STRING(2),
      allowNull: false,
      primaryKey: true,
      references: { model: Language, key: 'code' }
    }
  }

  for (const [key, value] of Object.entries(model.rawAttributes)) {
    if (value.comment && value.comment.includes('@localize')) {
      attrs[key] = Object.assign({}, value)
      attrs[key].comment = attrs[key].comment.replace('@localize', '')
    }
  }

  const locale = sequelize.define(model.name + 'Locale', attrs, {
    sequelize,
    schema: config.database.schemaLocale
  })

  locale.belongsTo(model, {
    foreignKey: 'sourceId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  model.hasMany(locale, { foreignKey: 'sourceId' })

  model.Locale = locale
}
