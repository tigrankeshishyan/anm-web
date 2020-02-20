import React, { useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';

import ContentSection from 'sections/ContentSection';
import SectionWithFetchMore from 'sections/SectionWithFetchMore';

import SEO from 'components/SEO';
import Tag from 'components/Tag';
import NewsCard from 'components/NewsCard';
import PageTitle from 'components/PageTitle';

import { defaultFilter } from '_graphql/constants';

import { withI18n } from 'localization/helpers';

import {
  FETCH_NEWS,
  FETCH_TAGS,
} from '_graphql/actions';

const defaultOffsetCount = 10;

const tagIdKey = 'tagId';

const getTagId = loc => {
  const params = new URLSearchParams(loc.search);
  return Number(params.get(tagIdKey));
};

const isTagIncluded = loc => loc.search.includes(tagIdKey);

function News (props) {
  const [
    fetchNews,
    {
      loading,
      fetchMore,
      data = {},
    }
  ] = useLazyQuery(FETCH_NEWS, {
    variables: {
      count: defaultOffsetCount,
      filter: defaultFilter,
    },
    notifyOnNetworkStatusChange: true,
  });

  const [fetchTags, { data: tagsData }] = useLazyQuery(FETCH_TAGS);

  const fetchNewsByTag = useCallback(() => {
    const variables = {
      filter: {
        ...defaultFilter,
      },
      count: defaultOffsetCount,
    };

    if (isTagIncluded(props.location)) {
      variables.filter = {
        ...variables.filter,
        articleTags: {
          some: {
            tagId: {
              equalTo: getTagId(props.location),
            }
          }
        }
      };
    }

    fetchNews({
      variables,
    });
  }, [fetchNews, props]);

  useEffect(() => {
    if (isTagIncluded(props.location)) {
      fetchTags();
      fetchNewsByTag();
    } else {
      fetchNews();
    }
  }, [fetchTags, fetchNewsByTag, fetchNews, props.location]);

  const {
    i18n,
    location,
    history,
  } = props;

  const news = lodashGet(data, 'articles.nodes', []);
  const totalCount = lodashGet(data, 'articles.totalCount', {});
  const tagId = getTagId(location);
  const currentTag = tagId && tagsData && tagsData.tags
    ? tagsData.tags.find(tag => tag.id === tagId)
    : null;

  const handleTagSearchRemove = useCallback(() => {
    history.push(`${history.location.pathname}`);
  }, [history]);
  
  return (
    <>
      <SEO
        titleTranslationId="news"
      />

      <ContentSection>
        <PageTitle
          title={i18n('news')}
        />

        {
          !!tagId && currentTag && (
            <div className="mrg-bottom-15 mrg-top-15">
                <span className="mrg-sides-5">
                  {i18n('news.filteredBy')}
                </span>

              <Tag
                text={currentTag.name}
                onRemove={handleTagSearchRemove}
                className="mrg-top-15 mrg-sides-5"
              />
            </div>
          )
        }

        <SectionWithFetchMore
          items={news}
          isLoading={loading}
          fetchMore={fetchMore}
          queryDataKey="articles"
          hasNextPage={news.length < totalCount}
          renderItem={cardData => (
            <NewsCard
              {...cardData}
              key={cardData.nodeId}
              src={cardData.poster && cardData.poster.url}
            />
          )}
        />
      </ContentSection>
    </>
  );
}

News.defaultProps = {};

News.propTypes = {};

export default withI18n(News);
