import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Purchase extends Model {
  static get PENDING () {
    return 1
  }

  static get PAID () {
    return 2
  }

  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        status: {
          type: Sequelize.INTEGER,
          comment: `PENDING = ${this.PENDING}, PAID = ${this.PAID}`,
          allowNull: false
        },
        promoCode: { type: Sequelize.STRING(32) },
        currency: {
          type: Sequelize.STRING(6),
          allowNull: false,
          comment: '@omit create, update\nCurrency requested fot this purchase'
        },
        price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
        discountPrice: { type: Sequelize.DECIMAL(12, 2) },
        token: {
          type: Sequelize.STRING(36),
          comment: '@omit\nToken to verify purchase request'
        }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Score, User } = models

    Purchase.belongsTo(Score, {
      as: 'score',
      foreignKey: { field: 'score_id', allowNull: false },
      onDelete: 'RESTRICT'
    })

    Purchase.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    })
  }
}
