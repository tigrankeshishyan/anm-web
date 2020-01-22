import React from 'react';
import { withI18n } from 'localization/helpers';
import Typography from '@material-ui/core/Typography';

function NotFound(props) {
  const {
    i18n,
  } = props;

  return (
    <div className="flex-row grow align-center justify-center pad-20">
      <Typography
        variant="h4"
        className="font-bold"
      >
        {i18n('pageNotFound')}
      </Typography>
    </div>
  );
}

export default withI18n(NotFound);
