import { imageAll } from '../images';

const musicianMain = `
  fragment musicianMain on Musician {
    biography
    birthday
    deathday
    firstName
    id
    lastName
    nodeId
    path
    photoId
    published
    publishedAt
    type
  }
`;

const musicianAll = `
  fragment musicianAll on Musician {
    ...musicianMain
    photo {
      ...imageAll
    }
  }

  ${musicianMain}
  ${imageAll}
`;

export {
  musicianMain,
  musicianAll,
};
