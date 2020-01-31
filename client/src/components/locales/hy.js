import { addLocaleKey } from 'localization/helpers';
import { PDF_VIEWER } from 'localization/constants';

import pdfViewerLocalesHy from 'components/PDFViewer/locales/hy';
import cookieLocalesHy from 'components/CookieBanner/locales/hy';
export default {
  ...addLocaleKey('cookies', cookieLocalesHy),
  ...addLocaleKey(PDF_VIEWER, pdfViewerLocalesHy),
};
