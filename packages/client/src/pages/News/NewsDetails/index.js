import React from 'react';
import get from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';

import { withI18n } from 'localization/helpers';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import ShareOnSocial from 'components/ShareOnSocial';
import PublishedText from 'components/PublishedText';
import SocialIcons from 'components/SocialIcons';
import NewsGallery from 'components/NewsGallery';
import SimilarNews from 'sections/SimilarNews';
import PageTitle from 'components/PageTitle';
import NoData from 'components/NoData';
import Link from 'components/Link';
import Tag from 'components/Tag';
import SEO from 'components/SEO';

import { noop } from 'helpers';

import {
  FETCH_SINGLE_ARTICLE,
} from '_graphql/actions/news';

import './styles.sass';

function NewsDetails(props) {
  const { data: { articleByPath: article = {} } = {} } = useQuery(FETCH_SINGLE_ARTICLE, {
    variables: {
      path: props.match.params.path,
    },
  });

  const {
    i18n,
  } = props;

  const posterUrl = get(article, 'poster.url', '');
  const authorName = get(article, 'author.firstName', '');
  const authorLastName = get(article, 'author.lastName', '');
  const author = `${authorName} ${authorLastName}`;
  const content = article.content || '';
  const tags = article.tags || [];

  return article.id
    ? (
      <div key={article.id}>
        <SEO
          author={author}
          imageUrl={posterUrl}
          title={article.title}
          description={article.description}
        />

        <PosterWithSectionBlock
          hideBlockOnMobile
          url={posterUrl}
          imgAlt={article.title}
        />

        <Grid
          container
          className="news-details-content"
        >
          <Grid
            item
            md={8}
            xs={12}
            className="news-content-wrapper"
          >
            <PageTitle
              title={article.title}
              className="pad-sides-10"
            />

            <PublishedText
              className="pad-sides-10"
              date={article.publishedAt}
            />

            <span className="pad-sides-10 secondary-text-color">
              {i18n('article.author')}
              {' '}
              {author}
            </span>

            <div
              className="break-word mrg-top-15 pad-10"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="mrg-top-15 pad-sides-10">
              <b className="font-bold">
                {i18n('followUs')}
              </b>
              <SocialIcons
                type="primary"
                className="mrg-top-15 justify-start"
              />
            </div>

            <div className="mrg-top-15 pad-sides-10">
              <iframe
                id="fb-iframe"
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media"
                allowTransparency="true"
                title="Armenian National Music's found project on behalf of Armenian Composers"
                src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FArmeniannationalmusic%2Fposts%2F1495517180571908&width=500"
              />
            </div>

            {!!tags.length && (
              <div className="pad-sides-10">
                {tags.map(tag => (
                  <Link to={`/news?tagId=${tag.id}`}>
                    <Tag
                      key={tag.id}
                      onClick={noop}
                      text={tag.name}
                      className="mrg-top-15"
                    />
                  </Link>
                ))}
              </div>
            )}
            <ShareOnSocial />
          </Grid>

          <Grid
            item
            md={4}
            xs={12}
          >
            <SimilarNews articleId={article.id}/>
          </Grid>

          <NewsGallery
            images={article.gallery ? article.gallery.images : []}
          />
        </Grid>
      </div>
    ) : !article && <NoData translationId="article.notFound"/>;
}

export default withI18n(NewsDetails);
