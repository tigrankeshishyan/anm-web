import { gql } from 'apollo-boost';

export const genreAll = gql`
  fragment genreAll on Genre {
    id
    name
    nodeId
  }
`;
