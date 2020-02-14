import { gql } from 'apollo-boost';

export const instrumentAll = gql`
  fragment instrumentAll on Instrument {
    id
    name
    nodeId
  }
`;
