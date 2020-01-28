import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ExtendedLink from './LocalizedLink';

function Link(props) {
  const {
    color,
    target,
    isLocal,
    className,
    onHoverColor,
    noDecoration,
    withDecoration,
    ...linkProps
  } = props;

  const LinkComp = isLocal
    ? ExtendedLink
    : (linkPr) => <a {...linkPr}>{linkPr.children}</a>;

  const generatedProps = {};

  if (target) {
    generatedProps.target = target;
  }

  if (target === '_blank') {
    generatedProps.rel = 'noreferer noopener';
  }

  return (
    <LinkComp
      {...linkProps}
      {...generatedProps}
      className={clsx(
        'anm-link',
        color, {
          'no-decoration': noDecoration,
          [`${onHoverColor}-on-hover`]: onHoverColor,
        },
        className,
      )}
    />
  );
}

Link.defaultProps = {
  className: '',
  isLocal: true,
  target: '',
  noDecoration: true,
  onHoverColor: 'inherit',
};

Link.propTypes = {
  isLocal: PropTypes.bool,
  target: PropTypes.string,
  className: PropTypes.string,
  noDecoration: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'white']),
  onHoverColor: PropTypes.oneOf(['inherit', 'blue', 'white']),
};

export default Link;
