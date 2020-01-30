import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Score extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        path: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          comment: 'SEO friendly name to use in url'
        },
        title: { type: Sequelize.STRING, comment: '@localize' },
        description: { type: Sequelize.STRING, comment: '@localize' },
        url: { type: Sequelize.STRING },
        prices: { type: Sequelize.JSONB, comment: 'amount - currency pairs' },
        stampRight: {
          type: Sequelize.STRING(12),
          comment:
            'Right side stamp page selection https://pdfcpu.io/getting_started/page_selection, ex. 1'
        },
        stampCenter: {
          type: Sequelize.STRING(12),
          comment:
            'Center side stamp page selection https://pdfcpu.io/getting_started/page_selection, ex. 2-'
        },
        published: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        publishedAt: {
          type: Sequelize.DATE,
          comment:
            "@omit create\nThis is automatically changed if 'published' changed, can be manually provided by 'admin'"
        }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Composition, Instrument, ScoreInstruments } = models

    Score.belongsTo(Composition, {
      as: 'composition',
      foreignKey: 'compositionId'
    })

    Score.belongsToMany(Instrument, {
      through: ScoreInstruments,
      as: 'instruments',
      foreignKey: 'scoreId'
    })
  }
}

export class ScoreInstruments extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}
