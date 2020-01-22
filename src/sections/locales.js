import { addLocaleKey } from 'locales/helpers';
import footerLocales from './Footer/locales';

export default {
  en: {
    ...addLocaleKey('footer', footerLocales.en),
  },
  hy: {
    ...addLocaleKey('footer', footerLocales.hy),
  },
};
