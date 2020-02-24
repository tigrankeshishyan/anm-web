import gql from 'graphql-tag';
import { imageAll } from '../images';

const musicianMain = gql`
    fragment musicianMain on Musician {
        id
        type
        path
        nodeId
        photoId
        birthday
        deathday
        lastName
        biography
        firstName
        published
        publishedAt
        professions: musicianProfessionsList {
            profession {
                id
                name
            }
        }
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
