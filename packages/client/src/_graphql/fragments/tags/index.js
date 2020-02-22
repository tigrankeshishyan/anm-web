import gql from 'graphql-tag';

export const tagAll = gql`
  fragment tagAll on Tag {
    id
    name
    nodeId
  }
`;
