const { getOptions, fetchGraphData } = require('../../gql/utils');

// Fetch query for news which are published
const query = id => `
  query {
    musician (id: ${id}) {
      biography
      birthday
      createdAt
      description
      firstName
      lastName
      photo {
        url
      }
      type
    }
  }
`;

module.exports.getSingleMusicianData = async (id, locale, url) => {
  try {
    const res = await fetchGraphData(getOptions(query(id), locale));
    const { musician } = (res.data || {});
    if (musician) {
      return {
        url,
        locale,
        content: musician.biography,
        imageUrl: musician.photo.url,
        description: musician.description,
        title: `${musician.firstName} ${musician.lastName}`,
      };
    } else {
      return {};
    }
  } catch (err) {
    console.log('Error fetching News --> : ', err);
  }
};
