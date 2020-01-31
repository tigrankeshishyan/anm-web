import React from 'react';
import lodashGet from 'lodash.get';

import Tag from 'components/Tag';

import { SCORE_DETAIL } from 'localization/constants';

import { withI18n } from 'localization/helpers';
import ScoreInfoSection from 'pages/ScoreDetails/ScoreInfoSection';

import './styles.sass';

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
            className="score-info-tag"
            text={`${firstName} ${lastName}`}
          />
        )}
      />
      <ScoreInfoSection
        data={instruments}
        title={i18n(`${SCORE_DETAIL}.instruments`)}
        dataRenderer={({ name }) => <Tag key={name} className="score-info-tag" text={name} />}
      />
    </>
  );
}

ScoreDetailsInfo.defaultProps = {};

ScoreDetailsInfo.propTypes = {};

export default withI18n(ScoreDetailsInfo);
