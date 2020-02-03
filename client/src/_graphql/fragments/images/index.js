import { gql } from 'apollo-boost';

export const imageAll = gql`
  fragment imageAll on Image {
    id
    url
    nodeId
    caption
  }
`;
