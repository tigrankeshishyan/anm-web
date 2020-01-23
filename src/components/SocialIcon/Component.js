import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as AllIcons from 'images/icons/social-icons';

import './styles.sass';

function SocialIcon(props) {
  const {
    className,
    iconType,
    iconName,
    ...iconProps
  } = props;

  const Icon = iconName
    ? AllIcons[`${iconName}Icon`] || null
    : null;

  return (
    <Icon
      {...iconProps}
      className={clsx('anm-social-icon', iconType, className)}
    />
  );
}

SocialIcon.defaultProps = {
  iconType: 'primary',
};

SocialIcon.propTypes = {
  iconType: PropTypes.string,
  iconName: PropTypes.string.isRequired,
};

export default SocialIcon;
