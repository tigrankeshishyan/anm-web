import Sequelize from 'sequelize'

const { Model } = Sequelize

export class Article extends Model {
  /**
   * @param {Sequelize} sequelize
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
        title: { type: Sequelize.STRING, comment: '@localize' },
        description: { type: Sequelize.TEXT, comment: '@localize' },
        content: { type: Sequelize.TEXT, comment: '@localize' },
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
    const { User, Image, Genre, Tag } = models

    Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' })
    Article.belongsTo(User, { as: 'updater', foreignKey: 'updaterId' })
    Article.belongsTo(Image, { as: 'poster', foreignKey: 'posterId' })
    Article.belongsTo(ArticleGallery, {
      as: 'gallery',
      foreignKey: 'galleryId'
    })

    Article.belongsToMany(Image, {
      through: ArticleImage,
      as: 'images',
      foreignKey: 'articleId'
    })
    Article.belongsToMany(Genre, {
      through: ArticleGenre,
      as: 'genres',
      foreignKey: 'articleId'
    })
    Article.belongsToMany(Tag, {
      through: ArticleTag,
      as: 'tags',
      foreignKey: 'articleId'
    })
  }
}

export class ArticleImage extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class ArticleGenre extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class ArticleTag extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class ArticleGalleryImages extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }
}

export class ArticleGallery extends Model {
  /**
   * @param {Sequelize} sequelize
   */
  static init (sequelize) {
    return super.init({}, { sequelize })
  }

  static associate (models) {
    const { Article, Image } = models

    ArticleGallery.hasOne(Article, {
      as: 'article',
      foreignKey: 'galleryId'
    })
    ArticleGallery.belongsToMany(Image, {
      through: ArticleGalleryImages,
      as: 'gallery',
      foreignKey: 'galleryId'
    })
  }
}
