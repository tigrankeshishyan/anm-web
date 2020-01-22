import React from 'react';
import PropTypes from 'prop-types';

import Link from 'components/Link';
import { elementType } from 'types';

import './styles.sass';

function SeeMoreLink(props) {
  const {
    title,
    linkTo,
  } = props;

  return (
    <Link
      replace
      to={linkTo}
      className="see-more-link"
    >
      {title}
      <span
        className="link-border"
      />
    </Link>
  );
}

SeeMoreLink.defaultProps = {};

SeeMoreLink.propTypes = {
  title: elementType,
  linkTo: PropTypes.string,
};

export default SeeMoreLink;
