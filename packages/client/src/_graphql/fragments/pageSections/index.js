import { gql } from 'apollo-boost';

export const pageSectionsAll = gql`
  fragment pageSectionsAll on PageSection {
    name
    page
    attrs
    nodeId
  }
`;
