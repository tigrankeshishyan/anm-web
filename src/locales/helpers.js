import { isWindowExists } from 'helpers';
import {
  languages,
  defaultLang,
  langStorageKey,
} from './index';

export const getCurrentLang = () => {
  if (isWindowExists()) {

    const routeLang = window.location.pathname.split('/')[1];

    // If founded item is one of supported languages
    return languages[routeLang]
      ? routeLang : localStorage.getItem(langStorageKey) || defaultLang;
  }
  return defaultLang;
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
