import gql from 'graphql-tag';

export const genreAll = gql`
  fragment genreAll on Genre {
    id
    name
    nodeId
  }
`;
