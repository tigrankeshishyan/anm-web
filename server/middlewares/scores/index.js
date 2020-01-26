const { getOptions, fetchGraphData } = require('../../gql/utils');

// Fetch query for news which are published
const query = id => `
  query {
    score (id: ${id}) {
      title
      description
    }
  }
`;

module.exports.getSingleScoreData = async (id, locale, url) => {
  try {
    const res = await fetchGraphData(getOptions(query(id), locale));
    const { score } = (res.data || {});
    if (score) {
      return {
        url,
        locale,
        description: score.description,
        title: score.title,
      };
    } else {
      return {};
    }
  } catch (err) {
    console.log('Error fetching News --> : ', err);
  }
};
