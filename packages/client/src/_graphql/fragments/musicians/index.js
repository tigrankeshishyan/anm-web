import { gql } from 'apollo-boost';
import { imageAll } from '../images';

const musicianMain = gql`
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

const musicianAll = gql`
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
