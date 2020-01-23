import React, { useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';

import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';

import SEO from 'components/SEO';
import PageTitle from 'components/PageTitle';

import ContentSection from 'sections/ContentSection';
import SectionWithFetchMore from 'sections/SectionWithFetchMore';
import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import { withI18n } from 'localization/helpers';

import {
  FETCH_SCORES,
} from '_graphql/actions';

import {
  defaultFilter,
} from '_graphql/constants';

import ScoresFilter from './ScoresFilter';
import ScoreListItem from './ScoreListItem';
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

      <PosterWithSectionBlock />

      <ContentSection>
        <Grid
          container
          spacing={10}
        >
          <Grid
            item
            md={6}
            xs={12}
          >
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
              direction="column"
              isLoading={loading}
              queryDataKey="scores"
              fetchMore={fetchMore}
              WrapperComponent={List}
              hasNextPage={pageInfo.hasNextPage}
              renderItem={score => (
                <ScoreListItem
                  key={score.nodeId}
                  scoreUrl={`/music-sheet-score/${score.path}/${score.id}`}
                  {...score}
                />
              )}
            />
          </Grid>

          <Grid
            item
            md={6}
            xs={12}
          >
            <ScoresContactForm />
          </Grid>
        </Grid>
      </ContentSection>
    </>
  );
}

export default withI18n(MusicSheetScores);
