import Sequelize from 'sequelize'

import * as generate from '../../utils/generate.util'

const { Model } = Sequelize

export class PromoCode extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        code: {
          type: Sequelize.STRING,
          unique: true,
          primaryKey: true,
          comment: '@omit create,update\nthis also will be used as id'
        },
        status: {
          type: Sequelize.STRING(32),
          defaultValue: 'active',
          comment: 'can be active, used, canceled'
        },
        percent: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: 'discount percent, default is 0'
        },
        expiresAt: { type: Sequelize.DATE }
      },
      { sequelize }
    )
  }

  /**
   * @returns {string} Promo code
   */
  static async createPromoCode () {
    const code = generate.code(6)

    if (await this.count({ where: { code } })) {
      return this.createPromoCode()
    }

    return code.toUpperCase()
  }

  /**
   * @param {number} count
   *
   * @returns {Array<string>}
   */
  static async createPromoCodes (count) {
    const promos = []

    let times = 0
    while (times++ < count) {
      promos.push(await PromoCode.createPromoCode())
    }

    return promos
  }
}
