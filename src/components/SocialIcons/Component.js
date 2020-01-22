import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { anmSocialIcons } from 'static/images/icons/components/social-icons';
import SocialIcon from 'components/SocialIcon';

import './styles.sass';

/**
 * Icons types are 'default' and 'primary'.
 * 'default' is white icon
 * 'primary' is blue
 * @param props
 * @returns {*}
 * @constructor
 */
function SocialIcons(props) {
  const {
    type,
    className,
  } = props;

  return (
    <div className={clsx('social-icons-wrapper flex-row wrap justify-center align-center', className)}>
      {anmSocialIcons
        .map((icon) => (
          <a
            target="_blank"
            key={icon.path}
            href={icon.path}
            rel="noopener noreferrer"
          >
            <SocialIcon
              iconType={type}
              iconName={icon.name}
              className="mrg-sides-5"
            />
          </a>
        ))}
    </div>
  );
}

SocialIcons.defaultProps = {
  className: '',
  type: 'default',
};

SocialIcons.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['default', 'primary']),
};

export default SocialIcons;
