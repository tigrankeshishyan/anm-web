import { addLocaleKey } from 'locales/helpers';
import { PDF_VIEWER } from 'locales/constants';
import cookieLocales from 'components/CookieBanner/locales';
import pdfViewerLocales from 'components/PDFViewer/locales';

export default {
  hy: {
    ...addLocaleKey('cookies', cookieLocales.hy),
    ...addLocaleKey(PDF_VIEWER, pdfViewerLocales.hy),
  },
  en: {
    ...addLocaleKey('cookies', cookieLocales.en),
    ...addLocaleKey(PDF_VIEWER, pdfViewerLocales.en),
  }
};
