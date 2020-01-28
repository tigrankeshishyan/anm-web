import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Genre extends Model {
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
    const { ArticleGenre, Article } = models

    Genre.belongsToMany(Article, {
      through: ArticleGenre,
      as: 'genres',
      foreignKey: 'genreId'
    })
  }
}
