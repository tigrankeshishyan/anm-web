import React from 'react';
import PropTypes from 'prop-types';

import Img from 'components/Img';
import Link from 'components/Link';
import CardFooter from 'components/CardFooter';

import './styles.sass';

const imageSizes = {
  width: 600,
};

function NewsCard(props) {
  const {
    publishedAt,
    className,
    title,
    path,
    src,
    id,
  } = props;

  return (
    <Link
      to={`/news/${path}/${id}`}
      className={`news-card flex-column ${className}`}
    >
      <div className="news-card-poster-image-wrapper">
        <Img
          fitImage
          src={src}
          alt={title}
          sizes={imageSizes}
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
  title: '',
  poster: {},
  className: '',
  publishedAt: null,
};

NewsCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  publishedAt: PropTypes.string,
  poster: PropTypes.shape({
    url: PropTypes.string,
    caption: PropTypes.string,
  }),
};

export default NewsCard;
