import gql from 'graphql-tag';
import { newsAll } from '_graphql/fragments/news';

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

export const FETCH_SINGLE_ARTICLE = gql`
  query Article($path: String!) {
    articleByPath(
        path: $path
    ) {
      ...newsAll
    }
  }
  ${newsAll}
`;
