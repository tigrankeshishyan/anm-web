import React from 'react';
import get from 'lodash.get';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { withI18n } from 'localization/helpers';
import { isWindowExists } from 'helpers';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import SocialShareIcons from 'components/SocialShareIcons';
import PublishedText from 'components/PublishedText';
import NewsGallery from 'components/NewsGallery';
import SimilarNews from 'components/SimilarNews';
import PageTitle from 'components/PageTitle';
import NoData from 'components/NoData';
import Link from 'components/Link';
import Tag from 'components/Tag';
import SEO from 'components/SEO';

import { noop } from 'helpers';

import './styles.sass';

function NewsDetails(props) {
  const {
    i18n,
    pageContext,
  } = props;

  const { article } = pageContext;

  const posterUrl = get(article, 'poster.url', '');
  const authorName = get(article, 'author.firstName', '');
  const authorLastName = get(article, 'author.lastName', '');
  const author = `${authorName} ${authorLastName}`;
  const content = article.content || '';
  const tags = article.tags || [];

  return article.id
    ? (
      <>
        <SEO
          author={author}
          imageUrl={posterUrl}
          title={article.title}
          url={pageContext.pageUrl}
          locale={pageContext.locale}
          description={article.description}
        />

        <PosterWithSectionBlock
          url={posterUrl}
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
              date={article.publishedAt}
              className="pad-sides-10"
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

            <div className="mrg-top-15 pad-sides-10">
              <Divider/>

              <Typography
                color="primary"
                className="share-on-social-text"
              >
                {i18n('shareOnSocial')}
              </Typography>

              <div className="mrg-top-15">
                <SocialShareIcons/>
              </div>
            </div>
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
      </>
    ) : !article && <NoData translationId="article.notFound"/>;
}

NewsDetails.defaultProps = {};

NewsDetails.propTypes = {};

export default withI18n(NewsDetails);
