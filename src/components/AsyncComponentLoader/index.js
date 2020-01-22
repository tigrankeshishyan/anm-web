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
 * @param {boolean} isClass - should return function or class component
 * @returns {Element}
 * @constructor
 */
const AsyncComponentLoader = (Component, loaderProps = {}, isClass = false) => {
  if (isClass) {
    return class extends React.Component {
      render() {
        return (
          <Suspense fallback={<Loader {...loaderProps} />}>
            <Component {...this.props} />
          </Suspense>
        );
      }
    };
  }
  return (props) => (
    <Suspense fallback={<Loader {...loaderProps} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default AsyncComponentLoader;
