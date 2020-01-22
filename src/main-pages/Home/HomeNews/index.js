import React from 'react';
import { findImageNodeByUrl } from 'helpers';
import { graphql, useStaticQuery } from 'gatsby';
import { withI18n } from 'localization/helpers';
import { useQuery } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';

import SectionTitle from 'components/SectionTitle';
import NewsCard from 'components/NewsCard';
import Loading from 'components/Loading';

import {
  FETCH_NEWS,
} from '_graphql/actions/news';
import { defaultFilter } from '_graphql/constants';

import './styles.sass';

function HomeLatestNewsSection(props) {
  const { data, loading } = useQuery(FETCH_NEWS, {
    variables: {
      count: 3,
      filter: defaultFilter,
    },
  });

  const imageData = useStaticQuery(graphql`
    query {
      images: allFile(filter: { name: { regex: "/article-image/"}}) {
        ...allImageFilesMax400
      }
    }
  `);

  const {
    i18n,
  } = props;

  const articles = lodashGet(data, 'articles.nodes') || [];

  return (
    <Loading isLoading={loading}>
      <div className="latest-news">
        <SectionTitle
          type="short"
          linkTo="/news"
          position="right"
          title={i18n('news')}
          linkTitle={i18n('seeAllNews')}
        />

        <div className="flex-row wrap justify-center latest-news-cards-wrapper">
          {articles.map(({ publishedAt, ...article }) => (
            <NewsCard
              {...article}
              key={article.id}
              src={article.poster && article.poster.url}
            />
          ))}
        </div>
      </div>
    </Loading>
  );
}

HomeLatestNewsSection.defaultProps = {};

HomeLatestNewsSection.propTypes = {};

export default withI18n(HomeLatestNewsSection);
