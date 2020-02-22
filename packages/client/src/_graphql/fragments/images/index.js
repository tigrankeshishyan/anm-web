import gql from 'graphql-tag';

export const imageAll = gql`
  fragment imageAll on Image {
    id
    url
    nodeId
    caption
  }
`;
