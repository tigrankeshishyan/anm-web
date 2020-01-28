import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Playlist extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        isPublic: { type: Sequelize.BOOLEAN, defaultValue: false },
        name: { type: Sequelize.STRING, comment: '@localize' }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { User, Media, PlaylistMedia, Musician, MusicianPlaylist } = models

    Playlist.belongsTo(User, { foreignKey: 'ownerId' })
    Playlist.belongsToMany(Media, {
      through: PlaylistMedia,
      as: 'playlist',
      foreignKey: 'playlistId'
    })
    Playlist.belongsToMany(Musician, {
      through: MusicianPlaylist,
      as: 'musicians',
      foreignKey: 'playlistId'
    })
  }
}

export class PlaylistMedia extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        index: {
          type: Sequelize.INTEGER,
          comment: 'Order in playlist',
          validate: { min: 1 }
        }
      },
      { sequelize }
    )
  }
}
