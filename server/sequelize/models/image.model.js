import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Image extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init(
      {
        url: { type: Sequelize.STRING, allowNull: false },
        caption: { type: Sequelize.STRING, comment: '@localize' },
        description: { type: Sequelize.STRING, comment: '@localize' }
      },
      { sequelize }
    )
  }

  static associate (models) {
    const {
      Article,
      ArticleGallery,
      ArticleGalleryImages,
      ArticleImage,
      Group,
      GroupImage,
      Musician,
      MusicianImage
    } = models

    Image.belongsToMany(Article, {
      through: ArticleImage,
      as: 'articles',
      foreignKey: 'imageId'
    })
    Image.belongsToMany(Musician, {
      through: MusicianImage,
      as: 'musicians',
      foreignKey: 'imageId'
    })
    Image.belongsToMany(Group, {
      through: GroupImage,
      as: 'groups',
      foreignKey: 'imageId'
    })
    Image.belongsToMany(ArticleGallery, {
      through: ArticleGalleryImages,
      as: 'images',
      foreignKey: 'imageId'
    })
  }
}
