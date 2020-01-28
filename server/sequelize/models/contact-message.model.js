import Sequelize from 'sequelize'

const { Model } = Sequelize

export class ContactMessage extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        name: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING, allowNull: false },
        message: { type: Sequelize.STRING, allowNull: false },
        attachedFile: { type: Sequelize.STRING, comment: 'optional file attached by user' }
      },
      { sequelize }
    )
  }
}
