import React from 'react';
import PropTypes from 'prop-types';

import Link from 'components/Link';
import Img from 'components/Img';
import CardFooter from 'components/CardFooter';

import './styles.sass';

function MusicianCard(props) {
  const {
    firstName,
    lastName,
    src,
    path,
  } = props;

  const musicianFullName = `${firstName || ''} ${lastName || ''}`;

  return (
    <Link
      to={`/musician/${path}`}
      className="flex-column anm-musician-card"
    >
      <div className="musician-card-poster-image-wrapper">
        <Img
          src={src}
          className="musician-card-poster-image"
        />
      </div>

      <CardFooter
        title={musicianFullName}
        titleClassName="font-bold"
      />
    </Link>
  );
}

MusicianCard.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  path: PropTypes.string,
  nodeId: PropTypes.string,
  photoId: PropTypes.number,
  published: PropTypes.bool,
  birthday: PropTypes.string,
  lastName: PropTypes.string,
  firstName: PropTypes.string,
  biography: PropTypes.string,
  publishedAt: PropTypes.string,
  photo: PropTypes.shape({
    url: PropTypes.string,
  })
};

export default MusicianCard;
