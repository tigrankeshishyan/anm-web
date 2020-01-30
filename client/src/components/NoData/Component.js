import React from 'react';
import PropTypes from 'prop-types';
import { withI18n } from 'localization/helpers';

function NoData(props) {
  const {
    i18n,
    translationId,
  } = props;

  return (
    <div className="flex-row grow align-center justify-center font-bold">
      {i18n(translationId)}
    </div>
  );
}

NoData.defaultProps = {
  translationId: 'noData',
};

NoData.propTypes = {
  translationId: PropTypes.string,
};

export default withI18n(NoData);
