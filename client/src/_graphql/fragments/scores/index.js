const scoreMain = `
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

module.exports = {
  scoreMain,
};
