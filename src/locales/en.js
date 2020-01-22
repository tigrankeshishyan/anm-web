import componentsLocales from 'components/locales';
import templatesLocales from 'templates/locales';
import sectionsLocales from 'sections/locales';
import pagesLocales from 'main-pages/locales';
import authLocales from 'Auth/locales';
import globalLocales from './global';

export default {
  ...authLocales.en,
  ...pagesLocales.en,
  ...globalLocales.en,
  ...sectionsLocales.en,
  ...templatesLocales.en,
  ...componentsLocales.en,
};
