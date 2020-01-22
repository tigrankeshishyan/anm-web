import React, { useEffect, useCallback } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';
import { graphql, navigate, useStaticQuery } from 'gatsby';

import ContentSection from 'sections/ContentSection';
import SectionWithFetchMore from 'sections/SectionWithFetchMore';
import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import SEO from 'components/SEO';
import Tag from 'components/Tag';
import NewsCard from 'components/NewsCard';
import PageTitle from 'components/PageTitle';

import { defaultFilter } from '_graphql/constants';

import { findImageNodeByUrl } from 'helpers';

import { withI18n } from 'localization/helpers';

import {
  FETCH_NEWS,
  FETCH_TAGS,
} from '_graphql/actions';

const defaultOffsetCount = 10;

const tagIdKey = 'tagId';

function News(props) {
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

  const imageData = useStaticQuery(graphql`
    query {
      images: allFile(filter: { name: { regex: "/article-image/"}}) {
        ...allImageFilesMax400
      }
    }
  `);

  const [fetchTags, { data: tagsData }] = useLazyQuery(FETCH_TAGS);

  useEffect(() => {
    if (props.location.search) {
      handleNewsFetch();
    } else {
      fetchNews();
    }

    if (props.location.search.includes(tagIdKey)) {
      fetchTags();
    }
  }, [props.location.search]);

  const {
    i18n,
    location,
    pageContext,
  } = props;

  const news = lodashGet(data, 'articles.nodes', []);
  const totalCount = lodashGet(data, 'articles.totalCount', {});
  const pagePosterUrl = lodashGet(pageContext.sectionData, 'attrs.pagePosterUrl', '');
  const params = new URLSearchParams(location.search);
  const tagId = Number(params.get(tagIdKey));
  const currentTag = tagId && tagsData && tagsData.tags
    ? tagsData.tags.find(tag => tag.id === tagId)
    : null;

  const handleNewsFetch = useCallback(() => {
    const variables = {
      count: defaultOffsetCount,
    };

    if (tagId) {
      variables.filter = {
        ...defaultFilter,
        articleTags: {
          some: {
            tagId: {
              equalTo: tagId,
            }
          }
        }
      };
    }

    fetchNews({
      variables,
    });
  }, [news, tagId]);

  const handleTagSearchRemove = useCallback(() => {
    navigate(`/${location.pathname}`);
  }, [location]);

  return (
    <>
      <SEO
        imageUrl={pagePosterUrl}
        titleTranslationId="news"
        url={pageContext.pageUrl}
        locale={pageContext.locale}
      />

      <PosterWithSectionBlock
        url={pagePosterUrl}
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
