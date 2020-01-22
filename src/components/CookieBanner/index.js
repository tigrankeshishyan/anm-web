import React from 'react';
// import PropTypes from 'prop-types';
import {
  Cookies,
  CookiesProvider,
  CookieBannerUniversal,
} from 'react-cookie-banner';

import { withI18n } from 'localization/helpers';
import { getCurrentLang } from 'locales/helpers';

import './styles.sass';

const anmCookieKey = 'anm-user-cookies-accept-status';

const cookies = new Cookies();

function CookieBanner(props) {
  const {
    i18n,
  } = props;

  if (!cookies.cookies || cookies.cookies[anmCookieKey]) {
    return null;
  }

  return (
    <CookiesProvider
      cookies={cookies}
    >
      <CookieBannerUniversal
        cookie={anmCookieKey}
        dismissOnClick={false}
        dismissOnScroll={false}
        className="anm-cookie-banner"
        buttonMessage={i18n('submit')}
        message={i18n('cookies.cookieText')}
        link={<a href={`/${getCurrentLang()}/terms`} target="_blank">{i18n('termsAndPrivacyPolicy')}</a>}
      />
    </CookiesProvider>
  );
}

CookieBanner.defaultProps = {};

CookieBanner.propTypes = {};

export default withI18n(CookieBanner);
