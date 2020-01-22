import Tag from 'components/Tag';
import { SCORE_DETAIL } from 'locales/constants';
import React from 'react';
import PropTypes from 'prop-types';

// import './styles.sass';

function ScoreInfoSection(props) {
  const {
    data,
    title,
    dataRenderer,
  } = props;

  return data.length
    ? (
      <div className="info-section-wrapper mrg-top-15">
        <span className="mrg-bottom-15">
          {title}
        </span>
        <div className="flex-row mrg-top-15 align-center wrap">
          {data.map(dataRenderer)}
        </div>
      </div>
    ) : null;
}

ScoreInfoSection.defaultProps = {
  data: [],
  title: '',
};

ScoreInfoSection.propTypes = {
  data: PropTypes.array,
  title: PropTypes.string,
  dataRenderer: PropTypes.func,
};

export default ScoreInfoSection;
