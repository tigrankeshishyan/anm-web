import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  createEmptyImg,
  addImageProportions,
} from 'helpers/images';

import DefaultImage from 'images/defaultImage.jpg';

import './styles.sass';

createEmptyImg(DefaultImage, 200);

// Load placeholder
const loadedImages = new Set();

function Img(props) {
  const [isImageLoaded, setImageLoadedStatus] = useState(false);
  const imgRef = useRef();

  const {
    alt,
    src,
    sizes,
    onLoad,
    onClick,
    fitImage,
    fitParent,
    className,
    ...imageProps
  } = props;

  const imageSrc = addImageProportions(src, sizes.width, sizes.height, fitImage);

  // It will be run only once for the same src.
  useEffect(() => {
    if (loadedImages.has(imageSrc)) {
      setImageLoadedStatus(true);
      return;
    }

    createEmptyImg(imageSrc, null, () => {
      // Preventing async image loading issues
      if (imgRef.current) {
        loadedImages.add(imageSrc);
        setImageLoadedStatus(true);
        onLoad && onLoad();
      }
    });
  }, [imageSrc, onLoad, sizes, fitImage]);

  const imageClasses = clsx(
    'anm-image',
    className,
    {
      'with-cursor': !!onClick,
      'fit-parent': fitParent,
      'anm-loaded-image': isImageLoaded,
    },
  );

  return (
    <img
      alt={alt}
      title={alt}
      ref={imgRef}
      onClick={onClick}
      className={imageClasses}
      src={imageSrc || DefaultImage}
      {...imageProps}
    />
  );
}

Img.defaultProps = {
  src: '',
  sizes: {},
  fitImage: false,
  fitParent: true,
  alt: 'Armenian National music',
};

Img.propTypes = {
  src: PropTypes.string,
  onLoad: PropTypes.func,
  onClick: PropTypes.func,
  fitImage: PropTypes.bool,
  fitParent: PropTypes.bool,
  className: PropTypes.string,
  sizes: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default Img;
