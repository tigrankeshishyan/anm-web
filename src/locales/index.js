const languages = {
  hy: {
    path: 'hy',
    locale: 'Հայ',
    suffix: 'HY',
    name: 'Հայերեն',
    localCode: 'հայ',
  },
  en: {
    path: 'en',
    locale: 'eng',
    suffix: 'EN',
    name: 'English',
    localCode: 'eng',
  },
};

const langStorageKey = 'anmLang';
const defaultLang = languages.en.path;
export {
  languages,
  defaultLang,
  langStorageKey,
}
