import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Img from 'components/Img';

import './styles.sass';

function BlockWithImage(props) {
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
      <div>
        <Img
          src={url}
        />
      </div>
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
