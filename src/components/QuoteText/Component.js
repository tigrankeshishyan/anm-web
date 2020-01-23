import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { ReactComponent as BlueNoteIcon } from 'images/icons/note-blue.svg';
import { elementType } from 'types';

import './styles.sass';

function QuoteText(props) {
  const {
    text,
    textColor,
    iconColor,
    quoteAuthor,
  } = props;

  if (!text) {
    return null;
  }

  return (
    <div className="quote-text">
      <span className={clsx('quote-text-symbol', `color-${iconColor}`)}>
        <BlueNoteIcon />
      </span>
      <p
        dangerouslySetInnerHTML={{ __html: text }}
        className={clsx('quote-text-text', `color-${textColor}`)}
      />
      {quoteAuthor && (
        <p className={clsx('quote-text-author mrg-top-15', `color-${textColor}`)}>
          {quoteAuthor}
        </p>
      ) }
    </div>
  );
}

QuoteText.defaultProps = {
  text: '',
  quoteAuthor: '',
  textColor: 'initial',
  iconColor: 'initial',
};

QuoteText.propTypes = {
  text: elementType,
  textColor: PropTypes.string,
  iconColor: PropTypes.string,
  quoteAuthor: PropTypes.string,
};

export default QuoteText;
