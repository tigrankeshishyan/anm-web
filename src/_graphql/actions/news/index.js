import { gql } from 'apollo-boost';

export const FETCH_NEWS = gql`
  query NewsQuery($count: Int, $offset: Int, $filter: ArticleFilter) {
    articles(
      first: $count
      offset: $offset
      filter: $filter
      orderBy: PUBLISHED_AT_DESC
    ) {
      nodes {
        id
        path
        title
        createdAt
        publishedAt
        poster {
          id
          url
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
      totalCount
    }
  }
`;
