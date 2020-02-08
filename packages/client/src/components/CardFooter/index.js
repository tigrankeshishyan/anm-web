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
    description,
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

      {date && (
        <PublishedText
          date={date}
          className="date-block"
        />
      )}

      {description && (
        <div
          title={description}
          className="truncate secondary-text-color"
        >
          {description}
        </div>
      )}
    </div>
  );
}

CardFooter.defaultProps = {
  title: '',
  date: null,
  className: '',
  description: '',
  titleClassName: '',
};

CardFooter.propTypes = {
  date: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  description: PropTypes.string,
  titleClassName: PropTypes.string,
};

export default CardFooter;
