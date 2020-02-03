import { gql } from 'apollo-boost';

export const scoreMain = gql`
  fragment scoreMain on Score {
    id
    url
    path
    title
    prices
    nodeId
    createdAt
    updatedAt
    published
    isPurchased
    publishedAt
    description
    composition {
      nodeId
      title
      description
      musiciansList {
        nodeId
        lastName
        firstName
      }
    }
    preview {
      url
    }
    instruments {
      nodes {
        name
      }
    }
  }
`;
