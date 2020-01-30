import { addLocaleKey } from 'locales/helpers';
import { PDF_VIEWER } from 'locales/constants';

import pdfViewerLocalesHy from 'components/PDFViewer/locales/hy';
import cookieLocalesHy from 'components/CookieBanner/locales/hy';
export default {
  ...addLocaleKey('cookies', cookieLocalesHy),
  ...addLocaleKey(PDF_VIEWER, pdfViewerLocalesHy),
};
