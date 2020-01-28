import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Document extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(32)
        },
        content: {
          type: Sequelize.TEXT,
          comment: '@localize'
        }
      },
      { sequelize }
    )
  }
}
