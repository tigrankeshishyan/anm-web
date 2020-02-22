import gql from 'graphql-tag';

export const pageSectionsAll = gql`
  fragment pageSectionsAll on PageSection {
    name
    page
    attrs
    nodeId
  }
`;
