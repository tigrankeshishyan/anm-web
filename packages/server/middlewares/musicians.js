import { getOptions, fetchGraphData } from '../utils/graphql.util';
import { ExpressError } from '../utils/error.util';

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

export const getSingleMusicianData = async (id, locale, url) => {
  const res = await fetchGraphData(getOptions(query(id), locale));
  const { musician } = res.data || {};

  if (!musician) {
    throw new ExpressError('not found', 404);
  }

  return {
    url,
    locale,
    content: musician.biography,
    imageUrl: musician.photo.url,
    description: musician.description,
    title: `${musician.firstName} ${musician.lastName}`
  };
};
