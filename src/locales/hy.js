import componentsLocales from 'components/locales';
import templatesLocales from 'templates/locales';
import sectionsLocales from 'sections/locales';
import pagesLocales from 'main-pages/locales';
import authLocales from 'Auth/locales';
import globalLocales from './global';

export default {
  ...authLocales.hy,
  ...pagesLocales.hy,
  ...globalLocales.hy,
  ...sectionsLocales.hy,
  ...templatesLocales.hy,
  ...componentsLocales.hy,
};
