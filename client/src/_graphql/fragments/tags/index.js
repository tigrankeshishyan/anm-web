import { gql } from 'apollo-boost';

export const tagAll = gql`
  fragment tagAll on Tag {
    id
    name
    nodeId
  }
`;
