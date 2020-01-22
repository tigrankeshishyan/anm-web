import { gql } from 'apollo-boost';

export const FETCH_MUSICIANS = gql`
  query FetchMusicians($count: Int, $offset: Int, $filter: MusicianFilter) {
    musicians(
      first: $count
      offset: $offset
      filter: $filter
    ) {
      nodes {
        id
        type
        path
        nodeId
        photoId
        birthday
        lastName
        firstName
        biography
        published
        publishedAt
        photo {
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
    }
  }
`;
