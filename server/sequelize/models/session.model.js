import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Session extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        sid: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        sess: { type: Sequelize.JSONB, allowNull: false },
        expire: { type: Sequelize.DATE, allowNull: false }
      },
      {
        sequelize,
        timestamps: false,
        comment: '@omit'
      }
    )
  }
}
