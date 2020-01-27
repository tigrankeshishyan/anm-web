const path = require('path');
const { getFetchFn } = require('../utils');
const { appDefaultData } = require('../constants');
const isBot = require('isbot');

const getUrl = req => process.env.REACT_APP_URL + req.originalUrl;

module.exports = (req, res) => {
  // Detect if the request comes from browser or from crawler, spider, etc.
  if (isBot(req.headers['user-agent'])) {
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
            ...appDefaultData,
            url,
            title,
            content,
            imageUrl,
            description,
          });
        });
    } else {
      res.render(path.resolve(__dirname, '../../views/layouts/main.hbs'), { ...appDefaultData, url });
    }
  } else {
    res.sendFile(path.resolve(__dirname, '../../build/index.html'));
  }
};
