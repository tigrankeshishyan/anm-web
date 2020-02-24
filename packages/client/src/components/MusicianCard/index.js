import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import Img from 'components/Img';
import Link from 'components/Link';
import CardFooter from 'components/CardFooter';

import './styles.sass';

const imageSizes = {
  width: 300,
};

function MusicianCard(props) {
  const {
    professions,
    firstName,
    lastName,
    path,
    src,
    id,
  } = props;

  const musicianProfessions = (professions || []).map(p => p.profession.name).join(', ');
  const musicianFullName = `${firstName || ''} ${lastName || ''}`;
  
  return (
    <Link
      to={`/musician/${path}/${id}`}
      className="flex-column anm-musician-card"
    >
      <div className="musician-card-poster-image-wrapper">
        <Img
          src={src}
          sizes={imageSizes}
          alt={musicianFullName}
          className="musician-card-poster-image"
        />
      </div>
      <CardFooter
        title={musicianFullName}
        titleClassName="font-bold"
        description={musicianProfessions}
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
