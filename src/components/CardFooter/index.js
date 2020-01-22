import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import PublishedText from 'components/PublishedText';

import './styles.sass';

function CardFooter(props) {
  const {
    date,
    title,
    className,
    titleClassName,
  } = props;

  return (
    <div
      className={clsx('card-footer flex-column grow justify-end', className)}
    >
      {title && (
        <Typography
          variant="h6"
          className={clsx('card-title-text', titleClassName)}
        >
          {title}
        </Typography>
      )}

      <PublishedText
        className="date-block"
        date={date}
      />
    </div>
  );
}

CardFooter.defaultProps = {
  title: '',
  date: null,
  className: '',
  titleClassName: '',
};

CardFooter.propTypes = {
  date: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
};

export default CardFooter;
