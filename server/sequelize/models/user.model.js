import Sequelize from 'sequelize'

import { passwordMaker, compareHash } from '../../utils/hash.util'

const { Model } = Sequelize

export const ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
  EDITOR: 'editor'
}

export const ROLES = Object.values(ROLE)

async function formatUserData (instance) {
  instance.password =
    instance.password && (await passwordMaker(instance.password))
  if (instance.role !== 'admin') {
    const adminsCount = await User.count({ where: { role: 'admin' } })
    if (adminsCount === 0) {
      instance.role = 'admin'
    }
  }
}

export class User extends Model {
  static init (sequelize) {
    return super.init(
      {
        firstName: { type: Sequelize.STRING(32) },
        lastName: { type: Sequelize.STRING(32) },
        avatar: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING, unique: true },
        facebookId: { type: Sequelize.BIGINT, unique: true },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
          comment: '@omit\n0 active, 1 blocked'
        },
        password: {
          type: Sequelize.STRING,
          comment: '@omit update,delete'
        },
        role: {
          type: Sequelize.STRING(32),
          allowNull: false,
          defaultValue: ROLE.MEMBER,
          comment: '@omit create,update'
        }
      },
      {
        sequelize,
        hooks: {
          beforeCreate: formatUserData,
          beforeUpdate: formatUserData
        }
      }
    )
  }

  /**
   * @param {string} password
   * @returns {Promise<boolean>}
   * @description Compare passwords.
   */
  async comparePassword (password) {
    return compareHash(password, this.get('password'))
  }
}

const ONE_HOUR = 60 * 60 * 1000

export class ResetPassword extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            isEmail: true
          }
        },
        attempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        isExpired: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false
        }
      },
      { sequelize, comment: '@omit' }
    )
  }

  static async findAndIncrement (token) {
    const resetPassword = await this.findOne({ where: { id: token } })

    if (new Date() - resetPassword.createdAt > ONE_HOUR) {
      resetPassword.set('isExpired', true)
      await resetPassword.save()
      throw new Error(
        'email reset link is expired, you have only one hour to use it'
      )
    }

    if (resetPassword.attempts < 3) {
      resetPassword.increment('attempts')
      await resetPassword.save()
      return resetPassword
    }

    throw new Error('too many attempts to change password')
  }
}
