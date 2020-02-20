import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import { withI18n } from 'localization/helpers';
import moment from 'helpers/date';

import './styles.sass';

const format = 'MMM DD YYYY, HH:mm';

function PublishedText(props) {
  const {
    date,
    i18n,
    className,
  } = props;

  if (!date) {
    return null;
  }

  return (
    <Typography
      color="textSecondary"
      className={className}
    >
      {i18n('published')}
      {' '}
      {moment(date).format(format)}
    </Typography>
  );
}

PublishedText.defaultProps = {
  className: '',
  date: null,
};

PublishedText.propTypes = {
  className: PropTypes.string,
  date: PropTypes.string,
};

export default withI18n(PublishedText);
