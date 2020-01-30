import Sequelize from 'sequelize'

const { Model } = Sequelize

export class PageSection extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({
      page: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      attrs: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} }
    }, {
      sequelize,
      indexes: [{ fields: ['page', 'name'], unique: true }]
    })
  }
}
