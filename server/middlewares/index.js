const path = require('path');
const { getSingleNewsData } = require('./news');
const { getSingleMusicianData } = require('./musicians');
const { getSingleScoreData } = require('./scores');

function isBot () {
  return true;
}

const getUrl = req => process.env.REACT_APP_URL + req.originalUrl;

const defaultData = {
  imageUrl: 'https://anmmedia.am/images/8d4f533b-e6b1-4e16-b6c0-4b849c817333',
  title: 'Armenian National music',
  description: 'Online platform which gives our users the possibility to listen, share and get more insight in Armenian music is sorted by epoch and genre.',
  keywords: 'Armenian Music,Հայ երաժշտություն,Armenia,Հայաստան,Music,Երաժշտություն,Khachatryan,Խաչատրյան,Mirzoyan,Միրզոյան,Babajanyan,Բաբաջանյան,Armenian,Հայկական,Yerevan,Երևան,News,Լուրեր,Kim,Կիմ,Kardashyan,Քարդաշյան,Kim Kardashyan,Քիմ Քարդաշյան,Media,Մեդիա,Violin,Ջութակ,Piano,Դաշնամուր,Duduk,Դուդուկ,Shvi,Շվի,Composer,Կոմպոզիտոր,Komitas,Կոմիտաս',
  content: 'Online platform which gives our users the possibility to listen, share and get more insight in Armenian music is sorted by epoch and genre.',
};

const getFetchFn = req => {
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
module.exports = (req, res) => {
  if (isBot()) {
    const fetchDataFn = getFetchFn(req);
    const url = getUrl(req);

    if (fetchDataFn) {
      fetchDataFn(req.params.id, req.params.locale, url)
        .then(data => {
          const {
            title,
            content,
            imageUrl,
            description,
          } = data;

          res.render(path.resolve(__dirname, '../../views/layouts/main.hbs'), {
            ...defaultData,
            url,
            title,
            content,
            imageUrl,
            description,
            keywords: defaultData.keywords,
          });
        });
    } else {
      res.render(path.resolve(__dirname, '../../views/layouts/main.hbs'), { ...defaultData, url });
    }
  } else {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
  }
};
