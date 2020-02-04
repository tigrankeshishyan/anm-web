import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from 'components/Link';
import { withI18n } from 'localization/helpers';

import './styles.sass';

function NavMenuItem(props) {
  const {
    translationKey,
    isActive,
    onClick,
    title,
    path,
    i18n,
  } = props;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={clsx('anm-header-navigation-menu-item anm-navigation-item horizontal-nav-menu-item', { active: isActive })}
    >
      {i18n(translationKey) || title}
    </Link>
  );
}

NavMenuItem.defaultProps = {};

NavMenuItem.propTypes = {
  path: PropTypes.string,
  title: PropTypes.string,
  isActive: PropTypes.bool,
  translationKey: PropTypes.string,
};

export default withI18n(NavMenuItem);
