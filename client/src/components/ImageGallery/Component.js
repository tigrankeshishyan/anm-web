import React from 'react';
import ReactImageGallery from 'react-image-gallery';

import './styles.sass';

function ImageGallery(props) {
  return (
    <ReactImageGallery
      {...props}
    />
  );
}

ImageGallery.defaultProps = {
  items: [],
  lazyLoad: true,
  showNav: false,
  showBullets: true,
  showThumbnails: false,
  showPlayButton: false,
  showFullscreenButton: false,
  useBrowserFullscreen: false,
};

export default ImageGallery;
