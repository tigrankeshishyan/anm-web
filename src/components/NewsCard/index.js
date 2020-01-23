import React from 'react';
import PropTypes from 'prop-types';

import Img from 'components/Img';
import Link from 'components/Link';
import CardFooter from 'components/CardFooter';

import './styles.sass';

function NewsCard(props) {
  const {
    publishedAt,
    title,
    path,
    src,
    id,
  } = props;

  return (
    <Link
      to={`/news/${path}/${id}`}
      className="news-card flex-column"
    >
      <div className="news-card-poster-image-wrapper">
        <Img
          src={src}
          className="news-card-poster-image"
        />
      </div>

      <CardFooter
        title={title}
        date={publishedAt}
      />
    </Link>
  );
}

NewsCard.defaultProps = {
  poster: {},
  title: '',
  publishedAt: null,
};

NewsCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  publishedAt: PropTypes.string,
  poster: PropTypes.shape({
    url: PropTypes.string,
    caption: PropTypes.string,
  }),
};

export default NewsCard;
