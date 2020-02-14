import React from 'react';

import Link from 'components/Link';
import Button from 'components/Button';

import { withI18n } from 'localization/helpers';

import './styles.sass';

function AuthNav(props) {
  const {
    i18n,
  } = props;
  
  return (
    <div className="flex-row align-center anm-authentication-nav-wrapper">
      <Link
        to="/auth/sign-in"
        className="anm-navigation-item"
      >
        {i18n('signIn')}
      </Link>
      <Link to="/auth/sign-up">
        <Button
          variant="gradient"
          className="anm-authentication-button"
        >
          {i18n('signUp')}
        </Button>
      </Link>
    </div>
  );
}

AuthNav.defaultProps = {};

AuthNav.propTypes = {};

export default withI18n(AuthNav);

