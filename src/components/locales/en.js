import { addLocaleKey } from 'locales/helpers';
import { PDF_VIEWER } from 'locales/constants';

import pdfViewerLocalesEn from 'components/PDFViewer/locales/en';
import cookieLocalesEn from 'components/CookieBanner/locales/en';

export default {
  ...addLocaleKey('cookies', cookieLocalesEn),
  ...addLocaleKey(PDF_VIEWER, pdfViewerLocalesEn),
};
