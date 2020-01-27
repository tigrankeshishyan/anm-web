const { getSingleNewsData } = require('./middlewares/news');
const { getSingleMusicianData } = require('./middlewares/musicians');
const { getSingleScoreData } = require('./middlewares/scores');

module.exports.getFetchFn = req => {
  const { originalUrl } = req;
  const { id } = req.params;

  if (id) {
    if (originalUrl.includes('news')) {
      return getSingleNewsData;
    }

    if (originalUrl.includes('musician')) {
      return getSingleMusicianData;
    }

    if (originalUrl.includes('score')) {
      return getSingleScoreData;
    }
  } else {
    return undefined;
  }
};
