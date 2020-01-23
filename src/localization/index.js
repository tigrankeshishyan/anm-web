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

  const locale = getCurrentLang() || defaultLang;

  useEffect(() => {
    if (isWindowExists() && locale && locale !== 'undefined') {
      // Application language will be set once the app started
      localStorage.setItem(langStorageKey, locale);
    }
  }, [locale]);

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
