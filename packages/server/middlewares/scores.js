import { getOptions, fetchGraphData } from '../utils/graphql.util'
import { ExpressError } from '../utils/error.util'

// Fetch query for news which are published
const query = id => `
  query {
    score (id: ${id}) {
      title
      poster
      description
      composition {
        musiciansList {
         firstName
         lastName
        }
      }
    }
  }
`

export const getSingleScoreData = async (id, locale, url) => {
  const res = await fetchGraphData(getOptions(query(id), locale))
  const { score } = res.data || {}

  if (!score) {
    throw new ExpressError('not found', 404)
  }

  const musicians = (score.composition || {}).musiciansList || [];
  
  const musiciansNames = musicians.map(m => `${m.firstName} ${m.lastName}`).join(',')
  
  return {
    url,
    locale,
    imageUrl: score.poster,
    description: score.description,
    title: `${musiciansNames} - ${score.title}`,
  }
}
