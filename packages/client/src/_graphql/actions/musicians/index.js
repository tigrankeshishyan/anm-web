import gql from 'graphql-tag';
import { musicianAll } from '_graphql/fragments/musicians';

export const FETCH_MUSICIANS = gql`
  query FetchMusicians($count: Int, $offset: Int, $filter: MusicianFilter) {
    musicians(
      first: $count
      offset: $offset
      filter: $filter
    ) {
      nodes {
       ...musicianAll
      }
      pageInfo {
        endCursor
        hasNextPage
        startCursor
        hasPreviousPage
      }
    }
  }
  ${musicianAll}
`;

export const FETCH_SINGLE_MUSICIAN = gql`
  query FetchMusician($id: Int!) {
    musician(
      id: $id
    ) {
      ...musicianAll
    }
  }

  ${musicianAll}
`;
