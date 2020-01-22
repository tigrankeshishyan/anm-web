import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './styles.sass';

function ContentSection(props) {
  const {
    style,
    children,
    className,
  } = props;

  return (
    <main
      style={style}
      className={clsx('content-section', className)}
    >
      {children}
    </main>
  );
}

ContentSection.defaultProps = {
  style: {},
};

ContentSection.propTypes = {
  style: PropTypes.shape({}),
  className: PropTypes.string,
};

export default ContentSection;
