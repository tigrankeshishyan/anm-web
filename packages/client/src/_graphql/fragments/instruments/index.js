import gql from 'graphql-tag';

export const instrumentAll = gql`
  fragment instrumentAll on Instrument {
    id
    name
    nodeId
  }
`;
