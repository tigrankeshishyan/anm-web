import Sequelize from 'sequelize'

import * as generate from '../../utils/generate.util'
import { maxValidationAttempts } from '../../config'

const { Op } = Sequelize

const { Model } = Sequelize

const PENDING = 'pending'
const SENT = 'sent'
const VERIFIED = 'verified'
const EXCESS = 'excess'

export class EmailVerification extends Model {
  static get STATUS () {
    return {
      PENDING,
      SENT,
      VERIFIED,
      EXCESS
    }
  }

  static get STATUSES () {
    return Object.values(this.STATUS)
  }

  static init (sequelize) {
    return super.init(
      {
        userId: { type: Sequelize.INTEGER },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        code: { type: Sequelize.STRING(32), comment: 'verification code' },
        status: {
          type: Sequelize.ENUM(this.STATUSES),
          defaultValue: PENDING
        },
        attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        sibMessageId: {
          type: Sequelize.STRING,
          comment: 'Send In Blue messageId'
        }
      },
      {
        indexes: [{ fields: ['user_id'] }],
        comment: '@omit',
        sequelize
      }
    )
  }

  static associate (models) {
    EmailVerification.belongsTo(models.User)
  }

  /**
   * @param {number} userId
   * @param {string} email
   */
  static async findOrCreateWithCode (userId, email) {
    const code = generate.code(6)
    const data = { userId, code, email }

    const [verification, isCreated] = await this.findOrCreate({
      where: { ...data },
      defaults: { ...data, status: PENDING }
    })

    if (!isCreated) {
      await verification.update({ status: PENDING, code })
    }

    return [verification, isCreated]
  }

  /**
   * @param {number} userId
   * @param {string} email
   * @param {string} code
   * @returns {number} Attempts remains to try.
   * @description Find row with status 'pending' or 'sent',
   * with provided 'userId', 'email' and compare 'code'.
   */
  static async verifyEmail (userId, email, code) {
    const where = {
      userId,
      email,
      status: { [Op.in]: [PENDING, SENT] }
    }

    const verification = await this.findOne({ where })
    if (!verification) {
      return false
    }

    const attempts = verification.attempts + 1

    if (verification.code === code) {
      await verification.update({
        status: VERIFIED,
        attempts
      })
      return null
    }

    if (verification.attempts >= maxValidationAttempts) {
      await verification.update({
        status: EXCESS,
        attempts
      })
    } else {
      await verification.update({
        attempts
      })
    }

    return maxValidationAttempts - attempts
  }

  /**
   * @param {number} userId
   * @param {string} email
   *
   * @description Find verification by userId and email.
   */
  static async byUserEmail (userId, email) {
    if (!(userId > 0)) throw new TypeError("'userId' must be integer")
    if (!email) {
      throw new TypeError("'email' is required to check status")
    }

    const where = {
      userId,
      email
    }

    return this.findOne({ where })
  }
}
