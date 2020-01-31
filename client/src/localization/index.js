import React, { useState } from 'react';
import { useEffect } from 'react';

import { IntlProvider } from 'react-intl';

import {
  langStorageKey,
  defaultLang,
} from 'localization/constants';
import { getCurrentLang } from 'localization/helpers';

function AnmIntlProvider(props) {
  const [messages, setMessages] = useState(undefined);

  const {
    children,
  } = props;

  const locale = getCurrentLang();

  useEffect(() => {
    if (locale) {
      import(`localization/translations/${locale}`)
        .then(res => {
          setMessages(res.default);
        });
    }
    
    if (locale
      && (locale!=='undefined')
      && !localStorage.getItem(langStorageKey)
    ) {
      // Application language will be set once the app started
      localStorage.setItem(langStorageKey, locale);
    }
  }, [locale]);

  if (!messages) {
    return null;
  }

  return (
    <IntlProvider
      locale={locale}
      messages={messages}
      defaultLocale={defaultLang}
    >
      {children}
    </IntlProvider>
  );
}

export default AnmIntlProvider;
