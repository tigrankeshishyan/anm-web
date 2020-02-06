import React, { useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';

import Grid from '@material-ui/core/Grid';

import SEO from 'components/SEO';
import PageTitle from 'components/PageTitle';

import ContentSection from 'sections/ContentSection';
import SectionWithFetchMore from 'sections/SectionWithFetchMore';

import { withI18n } from 'localization/helpers';

import {
  FETCH_SCORES,
} from '_graphql/actions';

import {
  defaultFilter,
} from '_graphql/constants';

import ScoreCard from './ScoreCard';
import ScoresFilter from './ScoresFilter';
import ScoresContactForm from './ScoresContactForm';

const defaultFetchCount = 10;

const defaultVariables = {
  count: defaultFetchCount,
};

function MusicSheetScores(props) {
  const [fetchScores, { data, loading, fetchMore }] = useLazyQuery(FETCH_SCORES, {
    filter: defaultFilter,
    variables: defaultVariables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const {
    i18n,
  } = props;

  const scores = lodashGet(data, 'scores.nodes', []);
  const pageInfo = lodashGet(data, 'scores.pageInfo', {});

  const handleScoreSearch = useCallback(filter => {
    fetchScores({
      variables: {
        ...defaultVariables,
        filter: { ...filter, ...defaultFilter },
      }
    });
  }, [fetchScores]);

  return (
    <>
      <SEO
        titleTranslationId="scores.title"
        descriptionTranslationId="scores.description"
      />

      <ContentSection>
        <PageTitle
          title={i18n('scores.title')}
        />

        <div className="flex-row nowrap align-center mrg-vertical-half justify-end">
          <ScoresFilter
            onFilter={handleScoreSearch}
          />
        </div>

        <SectionWithFetchMore
          items={scores}
          isLoading={loading}
          queryDataKey="scores"
          fetchMore={fetchMore}
          hasNextPage={pageInfo.hasNextPage}
          renderItem={score => (
            <ScoreCard
              key={score.nodeId}
              scoreUrl={`/music-sheet-score/${score.path}/${score.id}`}
              {...score}
            />
          )}
        />
        <Grid container className="mrg-top-15 justify-end">
          <Grid item xs={12} sm={8} md={6}>
            <ScoresContactForm />
          </Grid>
        </Grid>
      </ContentSection>
    </>
  );
}

export default withI18n(MusicSheetScores);
