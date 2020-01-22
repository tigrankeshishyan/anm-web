import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';

// import './styles.sass';

function PageTitle(props) {
  const {
    title,
    className,
  } = props;

  return (
    <Typography
      variant="h5"
      className={clsx('font-bold', className)}
    >
      {title}
    </Typography>
  );
}

PageTitle.defaultProps = {
  title: '',
};

PageTitle.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
};

export default PageTitle;
