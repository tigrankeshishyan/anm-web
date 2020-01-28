import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Profession extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        name: { type: Sequelize.STRING, unique: true, comment: '@localize' }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Musician, MusicianProfession } = models

    Profession.belongsToMany(Musician, {
      through: MusicianProfession,
      as: 'musicians',
      foreignKey: 'professionId'
    })
  }
}
