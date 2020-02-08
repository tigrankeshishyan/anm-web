import { gql } from 'apollo-boost';

export const scoreMain = gql`
  fragment scoreMain on Score {
    id
    url
    path
    title
    prices
    poster
    nodeId
    createdAt
    updatedAt
    published
    isPurchased
    publishedAt
    description
    composition {
      id
      nodeId
      title
      description
      musiciansList {
        id
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
