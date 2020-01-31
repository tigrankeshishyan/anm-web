import React from 'react';
import { useIntl } from 'react-intl';
import {
  languages,
  defaultLang,
  langStorageKey,
} from 'localization/constants';

// Designed for refactor. to not crash an app.
export const withI18n = (Comp) => (props) => {
  const intl = useIntl();

  const i18n = (key) => (intl.messages && intl.messages[key]) || ' ';

  return (
    <Comp {...props} i18n={i18n}/>
  );
};

export const divideTextToParagraphs = (text = '', symbol = '#$') => <>{text.split(symbol).map((txt, index) => <p
  key={index}>{txt}</p>)}</>;

export const getCurrentLang = () => {
  const routeLang = window.location.pathname.split('/')[1];

  // If founded item is one of supported languages
  return languages[routeLang]
    ? routeLang
    : localStorage.getItem(langStorageKey) || defaultLang;
};

/**
 * Add a key to all property names of the object.
 * example.
 * key = 'test', obj = { name: 'my name' }
 * result
 * newObj = { test.name: 'my name' }
 * @param key
 * @param obj
 */
export const addLocaleKey = (key, obj) => {
  const newObj = {};

  Object
    .keys(obj)
    .forEach(objKey => {
      newObj[`${key}.${objKey}`] = obj[objKey];
    });

  return newObj;
};
