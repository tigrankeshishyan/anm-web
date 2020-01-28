import Sequelize from 'sequelize'

const { Model } = Sequelize

export const MUSICIAN_TYPES = ['composer', 'artist']

export class Musician extends Model {
  /**
   * @param {Sequelize.Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        path: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          comment: 'SEO friendly name to use in url'
        },
        birthday: { type: Sequelize.DATEONLY },
        deathday: { type: Sequelize.DATEONLY },
        type: { type: Sequelize.STRING(32), allowNull: false },
        description: { type: Sequelize.TEXT, comment: '@localize' },
        firstName: { type: Sequelize.STRING, comment: '@localize' },
        lastName: { type: Sequelize.STRING, comment: '@localize' },
        biography: { type: Sequelize.TEXT, comment: '@localize' },
        published: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        publishedAt: {
          type: Sequelize.DATE,
          comment:
            "@omit create\nThis is automatically changed if 'published' changed, can be manually provided by 'admin'."
        }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const {
      Image,
      Group,
      GroupMusician,
      Profession,
      Genre,
      Tag,
      Playlist
    } = models

    // musician
    Musician.belongsTo(Image, { as: 'image', foreignKey: 'photoId' })
    Musician.belongsToMany(Group, {
      through: GroupMusician,
      as: 'groups',
      foreignKey: 'musicianId'
    })
    Musician.belongsToMany(Profession, {
      through: MusicianProfession,
      as: 'professions',
      foreignKey: 'musicianId'
    })
    Musician.belongsToMany(Genre, {
      through: MusicianGenre,
      as: 'genres',
      foreignKey: 'musicianId'
    })
    Musician.belongsToMany(Tag, {
      through: MusicianTag,
      as: 'tags',
      foreignKey: 'musicianId'
    })
    Musician.belongsToMany(Playlist, {
      through: MusicianPlaylist,
      as: 'playlists',
      foreignKey: 'musicianId'
    })
    Musician.belongsToMany(Image, {
      through: MusicianImage,
      as: 'images',
      foreignKey: 'musicianId'
    })
  }
}

export class MusicianProfession extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class MusicianGenre extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class MusicianTag extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class MusicianImage extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class MusicianPlaylist extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class MusicianComposition extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}
