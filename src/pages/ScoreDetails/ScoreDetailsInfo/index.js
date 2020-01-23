import React from 'react';
// import PropTypes from 'prop-types';
import lodashGet from 'lodash.get';

import Tag from 'components/Tag';

import { SCORE_DETAIL } from 'locales/constants';

import { withI18n } from 'localization/helpers';
import ScoreInfoSection from 'pages/ScoreDetails/ScoreInfoSection';

// import './styles.sass';

function ScoreDetailsInfo(props) {
  const {
    i18n,
    score,
  } = props;

  const instruments = lodashGet(score, 'instruments.nodes', []);
  const musiciansList = lodashGet(score, 'composition.musiciansList', []);

  return (
    <>
      <ScoreInfoSection
        data={musiciansList}
        title={i18n(`${SCORE_DETAIL}.composer`)}
        dataRenderer={({ nodeId, firstName, lastName }) => (
          <Tag
            key={nodeId}
            text={`${firstName} ${lastName}`}
          />
        )}
      />
      <ScoreInfoSection
        data={instruments}
        title={i18n(`${SCORE_DETAIL}.instruments`)}
        dataRenderer={({ name }) => <Tag key={name} text={name}/>}
      />
    </>
  );
}

ScoreDetailsInfo.defaultProps = {};

ScoreDetailsInfo.propTypes = {};

export default withI18n(ScoreDetailsInfo);
