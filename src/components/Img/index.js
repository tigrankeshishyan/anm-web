import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { addImageProportions } from 'helpers/images';

import './styles.sass';

// Load placeholder
const loadedImages = new Set();

function Img(props) {
  const [image, setImage] = useState({ src: props.src });
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

  // It will be run only once for the same src.
  useEffect((_) => {
    !loadedImages.has(src) && setImage({ src });

    const img = new Image();

    img.onload = (_) => {
      // Preventing async image loading issues
      if (imgRef.current) {
        loadedImages.add(src);
        setImage({ src });
        onLoad && onLoad();
      }
    };

    img.src = src;
  }, [src]);

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
      src={addImageProportions(image.src, sizes.width, sizes.height, fitImage)}
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
