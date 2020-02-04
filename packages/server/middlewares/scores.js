import { getOptions, fetchGraphData } from '../utils/graphql.util'
import { ExpressError } from '../utils/error.util'

// Fetch query for news which are published
const query = id => `
  query {
    score (id: ${id}) {
      title
      description
    }
  }
`

export const getSingleScoreData = async (id, locale, url) => {
  const res = await fetchGraphData(getOptions(query(id), locale))
  const { score } = res.data || {}

  if (!score) {
    throw new ExpressError('not found', 404)
  }

  return {
    url,
    locale,
    description: score.description,
    title: score.title
  }
}
