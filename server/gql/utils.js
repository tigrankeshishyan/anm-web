const fetch = require('isomorphic-fetch');

const getOptions = (query, lang = 'hy') => ({
  method: 'POST',
  body: JSON.stringify({ query }),
  headers: {
    'Content-type': 'application/json',
    'Accept-Language': lang,
  },
});

const apiUrl = process.env.REACT_APP_GRAPHQL_API;

module.exports.apiUrl = apiUrl;
module.exports.getOptions = getOptions;
module.exports.fetchGraphData = async (options, query) => await fetch(apiUrl, options || getOptions(query)).then(async (res) => await res.json());
module.exports.checkForErrors = (res, path) => res && res.errors && console.error(`Error on, ${path}`, res.errors);
