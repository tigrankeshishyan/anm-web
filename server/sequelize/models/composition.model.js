import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Composition extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        path: {
          type: Sequelize.STRING,
          unique: true,
          comment: 'SEO friendly name to use in url'
        },
        title: { type: Sequelize.STRING, comment: '@localize' },
        description: { type: Sequelize.STRING, comment: '@localize' },
        composingStart: { type: Sequelize.DATE },
        composingEnd: { type: Sequelize.DATE },
        published: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        publishedAt: {
          type: Sequelize.DATE,
          comment:
            "@omit create\nThis is automatically changed if 'published' changed, can be manually provided by 'admin'."
        }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Musician, MusicianComposition, Score } = models

    Composition.belongsToMany(Musician, {
      through: MusicianComposition,
      as: 'compositions',
      foreignKey: 'compositionId'
    })

    Composition.hasMany(Score, {
      as: 'scores',
      foreignKey: 'compositionId'
    })
  }
}
