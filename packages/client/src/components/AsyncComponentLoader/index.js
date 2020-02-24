import React, { Suspense } from 'react';

import Loading from 'components/Loading';

const loaderWrapperStyles = {
  flexGrow: 1,
  minHeight: 50,
  flexShrink: 0,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const Loader = (props) => {
  const {
    loadingText = 'Loading...',
    isText = false,
    showLoader = true,
    wrapperStyles = {},
    ...loaderProps
  } = props;

  if (!showLoader) {
    return null;
  }

  return (
    <div style={{ ...loaderWrapperStyles, ...wrapperStyles }}>
      {isText ? loadingText : <Loading {...loaderProps} isLoading />}
    </div>
  );
};

/**
 *
 * @param Component
 * @param {Object} loaderProps -
 * @returns {ReactElement}
 * @constructor
 */
const AsyncComponentLoader = (Component, loaderProps = {}) => {
  return props => (
    <Suspense fallback={<Loader {...loaderProps} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default AsyncComponentLoader;
