const SCORES = 'scores';
const PDF_VIEWER = 'pdfViewer';
const CONTACT_US = 'contactUs';
const SCORE_DETAIL = 'scoreDetail';
const USER_PROFILE = 'userProfile';

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
  SCORES,
  CONTACT_US,
  PDF_VIEWER,
  SCORE_DETAIL,
  USER_PROFILE,

  languages,
  defaultLang,
  langStorageKey,
}

