import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import Img from 'components/Img';
import ImageGallery from 'components/ImageGallery';

import './styles.sass';

const postUrl = 'https://www.facebook.com/Armeniannationalmusic/posts/1490085471115079';

function WhoWeAreGallery (props) {
  const {
    images,
  } = props;

  const sliderImages = useMemo(() => images.map(imgUrl => ({
    original: imgUrl,
  })), [images]);

  const handleImageClick = useCallback(() => {
      window.open(postUrl, '_blank');
  }, []);

  return (
    <div className="who-we-are-gallery-wrapper">
      <ImageGallery
        {...props}
        items={sliderImages}
        renderItem={img => (
          <Img
            src={img.original}
            className="slider-image"
            onClick={handleImageClick}
          />
        )}
      />
    </div>
  );
}

WhoWeAreGallery.defaultProps = {
  images: [],
};

WhoWeAreGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default WhoWeAreGallery;
