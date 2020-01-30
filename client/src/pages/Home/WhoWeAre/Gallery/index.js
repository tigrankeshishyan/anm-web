import React from 'react';
import PropTypes from 'prop-types';

import Img from 'components/Img';
import ImageGallery from 'components/ImageGallery';

import './styles.sass';

const imageSizes = {
  width: 500,
};

function WhoWeAreGallery(props) {
  const {
    images: propsImages,
  } = props;

  const sliderImages = (propsImages || []).map(imgUrl => ({
    original: imgUrl,
  }));

  return (
    <div className="who-we-are-gallery-wrapper">
      <ImageGallery
        {...props}
        items={sliderImages}
        renderItem={args => <Img sizes={imageSizes} src={args.original} />}
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