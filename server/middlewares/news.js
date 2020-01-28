import { getOptions, fetchGraphData } from '../utils/graphql.util'

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
  try {
    const res = await fetchGraphData(getOptions(query(id), locale))
    const { article } = res.data || {}
    if (article) {
      return {
        url,
        locale,
        title: article.title,
        content: article.content,
        imageUrl: article.poster.url,
        description: article.description
      }
    } else {
      return {
        title: 'Not Found',
        content: 'No Article Found'
      }
    }
  } catch (err) {
    console.log('Error fetching News --> : ', err)
  }
}
