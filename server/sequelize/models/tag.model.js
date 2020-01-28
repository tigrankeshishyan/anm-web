import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Tag extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        name: { type: Sequelize.STRING, unique: true, comment: '@localize' }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Article, ArticleTag } = models

    Tag.belongsToMany(Article, {
      through: ArticleTag,
      as: 'articles',
      foreignKey: 'tagId'
    })
  }
}
