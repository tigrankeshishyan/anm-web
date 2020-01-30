import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Instrument extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        name: { type: Sequelize.STRING(255), comment: '@localize' },
        description: { type: Sequelize.TEXT }
      },
      { sequelize }
    )
  }

  /**
   * @type {Object<string, typeof Sequelize.Model>}
   */
  static associate (models) {
    const { Score, ScoreInstruments } = models

    Instrument.belongsToMany(Score, {
      through: ScoreInstruments,
      as: 'scores',
      foreignKey: 'instrumentId'
    })
  }
}
