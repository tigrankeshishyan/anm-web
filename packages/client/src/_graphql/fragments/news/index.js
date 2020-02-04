import { gql } from 'apollo-boost';
import { imageAll } from '../images';
import { genreAll } from '../genres';
import { tagAll } from '../tags';

const newsMain = gql`
  fragment newsMain on Article {
    id
    path
    title
    nodeId
    content
    description
    publishedAt
  }
`;

const newsAll = gql`
  fragment newsAll on Article {
    ...newsMain
    author {
      id
      nodeId
      lastName
      firstName
    }
    images: imagesList {
      ...imageAll
    }
    tags: tagsList {
      ...tagAll
    }
    genres: genresList {
      ...genreAll
    }
    poster {
      ...imageAll
    }
    gallery {
      images: imagesList {
        ...imageAll
      }
    }
  }

  ${newsMain}
  ${tagAll}
  ${genreAll}
  ${imageAll}
`;

export {
  newsMain,
  newsAll,
};
