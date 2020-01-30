import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isMobile, isTablet } from 'react-device-detect';
import Img from 'components/Img';

import './styles.sass';

const getImageWidth = () => {
  return isMobile
    ? window.innerWidth
    : isTablet
      ? 600
      : 800
};

function BlockWithImage (props) {
  const {
    url,
    className,
  } = props;

  if (!url) {
    return null;
  }

  return (
    <div
      className={clsx('block-with-image flex-row justify-center align-center', className)}
    >
      <Img
        src={url}
        sizes={{ width: getImageWidth() }}
      />
    </div>
  );
}

BlockWithImage.defaultProps = {
  url: '',
  className: '',
};

BlockWithImage.propTypes = {
  url: PropTypes.string,
  className: PropTypes.string,
};

export default BlockWithImage;
