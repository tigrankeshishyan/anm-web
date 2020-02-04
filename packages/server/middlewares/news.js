import { getOptions, fetchGraphData } from '../utils/graphql.util'
import { ExpressError } from '../utils/error.util'

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
`

export const getSingleNewsData = async (id, locale, url) => {
  const res = await fetchGraphData(getOptions(query(id), locale))
  const { article } = res.data || {}

  if (!article) {
    throw new ExpressError('not found', 404)
  }

  return {
    url,
    locale,
    title: article.title,
    content: article.content,
    imageUrl: article.poster.url,
    description: article.description
  }
}
