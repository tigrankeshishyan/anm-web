import GraphileUtils from 'graphile-utils'

const { makeAddInflectorsPlugin } = GraphileUtils

function prefixForImagesOnArticle (junctionTable, rightTable, junctionLeftKeyAttributes) {
  if (
    junctionTable.name === 'articles' &&
    rightTable.name === 'images' &&
    junctionLeftKeyAttributes.length === 1 &&
    junctionLeftKeyAttributes[0].name === 'author_id'
  ) {
    return 'author-'
  }
  if (
    junctionTable.name === 'articles' &&
    rightTable.name === 'images' &&
    junctionLeftKeyAttributes.length === 1 &&
    junctionLeftKeyAttributes[0].name === 'updater_id'
  ) {
    return 'updater-'
  }
  return ''
}

export default makeAddInflectorsPlugin(
  {
    manyToManyRelationByKeys (
      _leftKeyAttributes,
      _junctionLeftKeyAttributes,
      _junctionRightKeyAttributes,
      _rightKeyAttributes,
      _junctionTable,
      rightTable,
      _junctionLeftConstraint,
      junctionRightConstraint
    ) {
      if (junctionRightConstraint.tags.manyToManyFieldName) {
        return junctionRightConstraint.tags.manyToManyFieldName
      }

      const prefix = prefixForImagesOnArticle(_junctionTable, rightTable, _junctionLeftKeyAttributes)

      return this.camelCase(
        `${prefix}${this.pluralize(this._singularizedTableName(rightTable))}`
      )
    },
    manyToManyRelationByKeysSimple (
      _leftKeyAttributes,
      _junctionLeftKeyAttributes,
      _junctionRightKeyAttributes,
      _rightKeyAttributes,
      _junctionTable,
      rightTable,
      _junctionLeftConstraint,
      junctionRightConstraint
    ) {
      if (junctionRightConstraint.tags.manyToManySimpleFieldName) {
        return junctionRightConstraint.tags.manyToManySimpleFieldName
      }

      const prefix = prefixForImagesOnArticle(_junctionTable, rightTable, _junctionLeftKeyAttributes)

      return this.camelCase(
        `${prefix}${this.pluralize(this._singularizedTableName(rightTable))}-list`
      )
    }
  },
  true
)
