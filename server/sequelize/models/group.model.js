import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Group extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        founded: { type: Sequelize.DATE },
        name: { type: Sequelize.STRING, comment: '@localize' },
        biography: { type: Sequelize.TEXT, comment: '@localize' }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const { Image, GroupImage, Playlist } = models

    Group.belongsTo(Image, { as: 'image', foreignKey: 'photoId' })
    Group.belongsToMany(Image, {
      through: GroupImage,
      as: 'images',
      foreignKey: 'groupId'
    })
    Group.belongsToMany(Playlist, {
      through: GroupPlaylist,
      as: 'playlists',
      foreignKey: 'groupId'
    })
  }
}

export class GroupImage extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class GroupMusician extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class GroupPlaylist extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}
