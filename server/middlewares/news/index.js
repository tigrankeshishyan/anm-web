const { getOptions, fetchGraphData } = require('../../gql/utils');

// Fetch query for news which are published
const query = id => `
  query {
    article (id: ${id}) {
      content
      createdAt
      description
      id
      path
      nodeId
      title
      updatedAt
      publishedAt
      poster {
        url
      }
    }
  }
`;

module.exports.getSingleNewsData = async (id, locale, url) => {
  try {
    const res = await fetchGraphData(getOptions(query(id), locale));
    const { article } = (res.data || {});
    if (article) {
      return {
        url,
        locale,
        title: article.title,
        content: article.content,
        imageUrl: article.poster.url,
        description: article.description,
      };
    } else {
      return {};
    }
  } catch (err) {
    console.log('Error fetching News --> : ', err);
  }
};
