// TODO: Remove all catalogs from  HTML. Instead load catalog for current language dynamically
// NOTE: It worked like that before. We removed because of gatsby static HTML.
// Helmet was unable to add meta tags with async data loading.

// TODO: Use react-intl's FormattedDateTime component instead of moment js.

import React from 'react';
import { useEffect } from 'react';

import { IntlProvider } from 'react-intl';

import enMessage from 'locales/en';
import hyMessage from 'locales/hy';

import {
  langStorageKey,
  defaultLang,
} from 'locales';
import { isWindowExists } from '../helpers';
import { getCurrentLang } from '../locales/helpers';

const messages = {
  en: enMessage,
  hy: hyMessage,
};

function AnmIntlProvider(props) {
  const {
    children,
  } = props;

  const locale = getCurrentLang()
  || props.pageContext && props.pageContext.locale
    ? props.pageContext.locale
    : defaultLang;

  useEffect(() => {
    if (isWindowExists() && locale && locale !== 'undefined') {
      // Application language will be set once the app started
      localStorage.setItem(langStorageKey, locale);
    }
  }, []);

  // TODO: There is an issue in react-intl related with language data import
  // Check console error
  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale={defaultLang}
    >
      {children}
    </IntlProvider>
  );
}

export default AnmIntlProvider;
