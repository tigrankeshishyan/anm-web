import { addLocaleKey } from 'localization/helpers';
import { PDF_VIEWER } from 'localization/constants';

import pdfViewerLocalesEn from 'components/PDFViewer/locales/en';
import cookieLocalesEn from 'components/CookieBanner/locales/en';

export default {
  ...addLocaleKey('cookies', cookieLocalesEn),
  ...addLocaleKey(PDF_VIEWER, pdfViewerLocalesEn),
};
