import React from 'react';
import PropTypes from 'prop-types';
import lodashGet from 'lodash.get';

import Img from 'components/Img';
import Link from 'components/Link';
import CardFooter from 'components/CardFooter';

import './styles.sass';

const imageSizes = {
  height: 400,
};

function ScoreCard(props) {
  const {
    title,
    poster,
    scoreUrl,
    composition,
    description,
  } = props;

  const musiciansList = lodashGet(composition, 'musiciansList', []);
  const musicians = musiciansList.map(m => `${m.firstName} ${m.lastName}`).join(',');

  return (
    <Link
      to={scoreUrl}
      className="score-card flex-column"
    >
      <div className="score-card-poster-image-wrapper">
        <Img
          fitImage
          alt={title}
          src={poster}
          sizes={imageSizes}
          className="score-card-poster-image"
        />
      </div>

      <CardFooter
        description={description}
        title={`${musicians} - ${title}`}
      />
    </Link>
  );
}

ScoreCard.defaultProps = {
  title: '',
  poster: '',
  description: '',
};

ScoreCard.propTypes = {
  title: PropTypes.string,
  poster: PropTypes.string,
  description: PropTypes.string,
};

export default ScoreCard;
