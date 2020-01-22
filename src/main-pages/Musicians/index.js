import React, { useState, useEffect, useCallback } from 'react';
import { useLazyQuery, } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';
import { graphql, useStaticQuery } from 'gatsby';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';
import ContentSection from 'sections/ContentSection';

import MusicianCard from 'components/MusicianCard';
import PageTitle from 'components/PageTitle';
import SEO from 'components/SEO';

import { findImageNodeByUrl } from 'helpers';
import { withI18n } from 'localization/helpers';

import {
  FETCH_MUSICIANS,
} from '_graphql/actions/musicians';
import { defaultFilter } from '_graphql/constants';
import SectionWithFetchMore from 'sections/SectionWithFetchMore';

import MusiciansFilter from './MusiciansFilter';

import './styles.sass';

const defaultOffsetCount = 10;

function Musicians(props) {
  const [isLoading, setLoading] = useState(true);
  const [fetchMusicians, { data, loading, fetchMore }] = useLazyQuery(FETCH_MUSICIANS, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    fetchMusiciansFiltered();
  }, []);

  const fetchMusiciansFiltered = useCallback(async filterData => {

    setLoading(true);

    const filter = {
      ...defaultFilter,
      ...(filterData || {}),
    };

    const variables = {
      filter,
      count: defaultOffsetCount,
    };

    await fetchMusicians({
      variables,
    });

    setLoading(false);
  }, []);

  const {
    i18n,
    pageContext,
  } = props;

  const musicians = lodashGet(data, 'musicians.nodes', []);
  const pageInfo = lodashGet(data, 'musicians.pageInfo', {});
  const isDataLoading = isLoading || loading;

  return (
    <div className="anm-musicians-section">
      <SEO
        titleTranslationId="musicians"
      />

      <PosterWithSectionBlock
      />

      <ContentSection>
        <PageTitle
          title={i18n('musicians')}
        />

        <div className="pad-20 flex-row align-center justify-end">
          <MusiciansFilter
            onFilter={fetchMusiciansFiltered}
          />
        </div>

        <SectionWithFetchMore
          items={musicians}
          fetchMore={fetchMore}
          queryDataKey="musicians"
          isLoading={isDataLoading}
          hasNextPage={pageInfo.hasNextPage}
          renderItem={cardData => (
            <MusicianCard
              {...cardData}
              key={cardData.nodeId}
              src={cardData.photo && cardData.photo.url}
            />
          )}
        />
      </ContentSection>
    </div>
  );
}

export default withI18n(Musicians);
