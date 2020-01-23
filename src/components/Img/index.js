import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { createEmptyImg, addImageProportions } from 'helpers/images';

import DefaultImage from 'images/defaultImage.jpg';

import './styles.sass';

createEmptyImg(DefaultImage, 200);

// Load placeholder
const loadedImages = new Set();

function Img(props) {
  const [image, setImage] = useState({ src: null });
  const imgRef = useRef();

  const {
    alt,
    src,
    sizes,
    onLoad,
    fitImage,
    fitParent,
    className,
    ...imageProps
  } = props;

  const imageSrc = addImageProportions(src, sizes.width, sizes.height, fitImage);

  // It will be run only once for the same src.
  useEffect((_) => {
    createEmptyImg(imageSrc, null, (_) => {
      // Preventing async image loading issues
      if (imgRef.current) {
        loadedImages.add(imageSrc);
        setImage({ src: imageSrc });
        onLoad && onLoad();
      }
    });
  }, [imageSrc, onLoad, sizes, fitImage]);

  const imageClasses = clsx(
    'anm-image',
    className,
    {
      'anm-default-image': !src,
      'fit-parent': fitParent,
      'anm-loaded-image': loadedImages.has(src),
    },
  );

  return (
    <img
      alt={alt}
      ref={imgRef}
      className={imageClasses}
      src={image.src ? image.src : DefaultImage}
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
  fitImage: PropTypes.bool,
  fitParent: PropTypes.bool,
  className: PropTypes.string,
  sizes: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default Img;
