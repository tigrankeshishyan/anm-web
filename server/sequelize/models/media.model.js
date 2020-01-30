import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Media extends Model {
  static get TYPES () {
    return ['video', 'audio']
  }

  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        url: { type: Sequelize.STRING, allowNull: false },
        mediaType: { type: Sequelize.ENUM(this.TYPES) },
        title: { type: Sequelize.STRING, comment: '@localize' }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Playlist, PlaylistMedia } = models

    Media.belongsToMany(Playlist, {
      through: PlaylistMedia,
      as: 'media',
      foreignKey: 'mediaId'
    })
  }
}
