import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import CircularProgress from '@material-ui/core/CircularProgress';

import './styles.sass';

function Loading(props) {
  const {
    style,
    children,
    isLoading,
    minHeight,
    className,
    spinnerColor,
    spinnerClassName,
  } = props;

  return (
    <div
      style={{...style, minHeight, }}
      className={clsx('anm-loader', className)}
    >
      {isLoading && (
        <div className="anm-loader-overlay">
          <CircularProgress
            size={24}
            color={spinnerColor}
            className={spinnerClassName}
          />
        </div>
      )}
      <div className="anm-loader-content">
        {children}
      </div>
    </div>
  );
}

Loading.propTypes = {
  minHeight: PropTypes.number,
  className: PropTypes.string,
  spinnerColor: PropTypes.string,
  spinnerClassName: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
};

Loading.defaultProps = {
  style: {},
  minHeight: 50,
  className: '',
  children: null,
  spinnerClassName: '',
  spinnerColor: 'primary',
};

export default Loading;
