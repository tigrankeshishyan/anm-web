import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { usePdf } from '@mikecousins/react-pdf';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Icon from 'components/Icon';
import Loading from 'components/Loading';

import { withI18n } from 'localization/helpers';
import {
  PDF_VIEWER,
} from 'localization/constants';

import './styles.sass';

const firstPage = 1;

const PDFViewer = (props) => {
  const [isLoading, setLoadingStatus] = useState(true);
  const [pageNumber, setPageNumber] = useState(firstPage);
  const [hasError, setHasErrorStatus] = useState(false);
  const canvasRef = useRef(null);
  
  const onDocumentLoadSuccess = useCallback(() => {
    setLoadingStatus(false);
  }, []);
  
  const onLoadError = useCallback(error => {
    console.error('PDF VIEWER ERROR :::', error);
    setHasErrorStatus(true);
    setLoadingStatus(false);
    setPageNumber(firstPage);
  }, []);
  
  const { pdfDocument } = usePdf({
    canvasRef,
    page: pageNumber,
    file: props.pdfUrl,
    onDocumentLoadFail: onLoadError,
    onDocumentLoadSuccess: onDocumentLoadSuccess,
  });
  
  const {
    i18n,
    className,
  } = props;

  const handleToPrevPage = useCallback(() => {
    setPageNumber(pageNumber => --pageNumber);
  }, []);
  
  const handleToNextPage = useCallback(() => {
    setPageNumber(pageNumber => ++pageNumber);
  }, []);
  
  const { numPages } = (pdfDocument || {});
  
  return (
    <Loading
      minHeight={300}
      isLoading={isLoading}
      className={clsx('anm-pdf-viewer-wrapper', className)}
    >
      <canvas
        ref={canvasRef}
        className="anm-pdf-viewer-canvas"
      />
      
      {!isLoading && pdfDocument && !hasError && (
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
