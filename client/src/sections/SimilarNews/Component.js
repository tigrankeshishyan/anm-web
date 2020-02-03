import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { withI18n } from 'localization/helpers';

import SectionTitle from 'components/SectionTitle';
import NewsCard from 'components/NewsCard';
import Loading from 'components/Loading';

import {
  FETCH_NEWS,
} from '_graphql/actions/news';
import { defaultFilter } from '_graphql/constants';

import 'sections/SimilarNews/styles.sass';

function SimilarNews(props) {
  const { data: { articles = {} } = {}, loading } = useQuery(FETCH_NEWS, {
    variables: {
      count: 3,
      filter: {
        not: {
          id: {
            equalTo: Number(props.articleId),
          },
        },
        ...defaultFilter,
      },
    },
  });

  const {
    i18n,
  } = props;

  const hasArticles = articles.nodes && !!articles.nodes.length;

  if (!loading && !hasArticles) {
    return null;
  }

  return (
    <Loading isLoading={loading}>
      <div className="similar-news-wrapper flex-column">
        {hasArticles && (
          <>
            <SectionTitle
              position="right"
              title={i18n('similarNews')}
            />

            <div className="similar-news flex-column">
              {articles.nodes.map(news => (
                <NewsCard
                  {...news}
                  key={news.id}
                  src={news.poster && news.poster.url}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Loading>
  );
}

SimilarNews.defaultProps = {};

SimilarNews.propTypes = {};

export default withI18n(SimilarNews);
