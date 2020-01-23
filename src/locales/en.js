import componentsLocales from 'components/locales';
import sectionsLocales from 'sections/locales';
import pagesLocales from 'pages/locales';
import authLocales from 'Auth/locales';
import globalLocales from './global';

export default {
  ...authLocales.en,
  ...pagesLocales.en,
  ...globalLocales.en,
  ...sectionsLocales.en,
  ...componentsLocales.en,
};
