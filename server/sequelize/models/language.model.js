import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Language extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        code: {
          type: Sequelize.STRING(2),
          primaryKey: true,
          allowNull: false,
          unique: true
        }
      },
      { sequelize, timestamps: false, comment: '@omit update,delete' }
    )
  }
}
