import { getOptions, fetchGraphData } from '../utils/graphql.util'

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
`

export const getSingleMusicianData = async (id, locale, url) => {
  try {
    const res = await fetchGraphData(getOptions(query(id), locale))
    const { musician } = res.data || {}
    if (musician) {
      return {
        url,
        locale,
        content: musician.biography,
        imageUrl: musician.photo.url,
        description: musician.description,
        title: `${musician.firstName} ${musician.lastName}`
      }
    } else {
      return {
        title: 'Not Found',
        content: 'No Musician Found'
      }
    }
  } catch (err) {
    console.log('Error fetching News --> : ', err)
  }
}
