import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf';
import {
  isMobile
} from 'react-device-detect';
import clsx from 'clsx';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Icon from 'components/Icon';
import Loading from 'components/Loading';

import { withI18n } from 'localization/helpers';
import {
  PDF_VIEWER,
} from 'locales/constants';

import './styles.sass';

const firstPage = 1;

const PDFViewer = (props) => {
  const [isLoading, setLoadingStatus] = useState(true);
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(firstPage);
  const [hasError, setHasErrorStatus] = useState(false);

  const {
    i18n,
    pdfUrl,
    className,
  } = props;

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setLoadingStatus(false);
    setNumPages(numPages);
  }, []);

  const onLoadError = useCallback(() => {
    setHasErrorStatus(true);
    setLoadingStatus(false);
    setPageNumber(firstPage);
  }, []);

  const handleToPrevPage = useCallback(() => {
    setPageNumber(pageNumber => --pageNumber);
  }, []);

  const handleToNextPage = useCallback(() => {
    setPageNumber(pageNumber => ++pageNumber);
  }, []);

  return (
    <Loading
      minHeight={300}
      isLoading={isLoading}
      className={clsx('anm-pdf-viewer-wrapper', className)}
    >
      <Document
        file={pdfUrl}
        onLoadError={onLoadError}
        onSourceError={onLoadError}
        width={isMobile ? 300 : 400}
        error={i18n('somethingWrong')}
        noData={i18n(`${PDF_VIEWER}.noFile`)}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={i18n(`${PDF_VIEWER}.loadingFile`)}
      >
        <Page
          pageNumber={pageNumber}
          onLoadError={onLoadError}
          onSourceError={onLoadError}
          height={isMobile ? 400 : 600}
          error={i18n('somethingWrong')}
          noData={i18n(`${PDF_VIEWER}.noPage`)}
          loading={i18n(`${PDF_VIEWER}.loadingPage`)}
        />
      </Document>

      {!isLoading && !hasError && pdfUrl && (
        <div className="flex-row justify-between wrap align-center">
          <p>
            {i18n(`${PDF_VIEWER}.page`)}
            {' '}
            {pageNumber} / {numPages}
          </p>
          <div>
            <Icon
              className="mrg-sides-10"
              onClick={handleToPrevPage}
              disabled={pageNumber === firstPage}
            >
              <ArrowBackIcon
              />
            </Icon>
            <Icon
              onClick={handleToNextPage}
              disabled={pageNumber === numPages}
            >
              <ArrowForwardIcon
              />
            </Icon>
          </div>
        </div>
      )}
    </Loading>
  );
};

PDFViewer.defaultProps = {
  pdfUrl: null,
};

PDFViewer.propTypes = {
  pdfUrl: PropTypes.string,
  className: PropTypes.string,
};

export default withI18n(PDFViewer);
