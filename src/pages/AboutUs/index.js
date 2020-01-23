import React from 'react';
import lodashGet from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';
import Partners from 'sections/Partners';

import SectionTitle from 'components/SectionTitle';
import QuoteText from 'components/QuoteText';
import PageTitle from 'components/PageTitle';
import Img from 'components/Img';
import SEO from 'components/SEO';

import KhazGroupedIcon from 'static/images/icons/components/KhazGrouped';

import { FETCH_SINGLE_PAGE_SECTION } from '_graphql/actions/pageSections';

import {
  withI18n,
  divideTextToParagraphs,
} from 'localization/helpers';

import './styles.sass';

function AboutUs(props) {
  const { data = {} } = useQuery(FETCH_SINGLE_PAGE_SECTION, {
    variables: {
      name: 'images',
      page: 'aboutUs',
    },
  });

  const {
    i18n,
  } = props;

  const pagePosterUrl = lodashGet(data.sectionData, 'attrs.pagePosterUrl', '');
  const motivationImgUrl = lodashGet(data.sectionData, 'attrs.motivationImgUrl', '');

  return (
    <div className="anm-about-us-section">
      <SEO
        title={i18n('aboutUs')}
        imageUrl={pagePosterUrl}
        description={i18n('aboutUs.info').split('#$').join('')}
      />

      <PosterWithSectionBlock
        url={pagePosterUrl}
      />

      <div className="about-us-content">
        <Grid
          container
          alignItems="center"
          justify="space-between"
        >
          <Grid
            item
            md={7}
            sm={12}
            className="about-us-text"
          >
            <PageTitle
              title={i18n('aboutUs')}
            />

            {divideTextToParagraphs(i18n('aboutUs.info'))}
          </Grid>

          <Hidden smDown>
            <Grid
              item
              md={3}
            >
              <KhazGroupedIcon/>
            </Grid>
          </Hidden>
        </Grid>
      </div>

      <>
        <SectionTitle
          position="right"
          blockWidth="70%"
          title={i18n('whyWeDoThis')}
        />

        <Grid
          container
          className="pad-top-30 pad-bottom-30 goal-section"
        >
          <Grid
            item
            md={4}
            xs={12}
          >
            <Img
              src={motivationImgUrl}
            />
          </Grid>

          <Grid
            item
            md={8}
            xs={12}
            className="pad-sides-15 why-we-do-text"
          >
            {divideTextToParagraphs(i18n('whyWeDoThisText'))}
          </Grid>
        </Grid>

        <div className="about-us-quote-section">
          <div className="quote-text-wrapper flex-row justify-center grow align-center">
            <QuoteText
              textColor="white"
              iconColor="white"
              text={i18n('aboutUs.quote')}
              quoteAuthor={i18n('komitas')}
            />
          </div>
        </div>
      </>
      <Partners/>
    </div>
  );
}

AboutUs.defaultProps = {};

AboutUs.propTypes = {};

export default withI18n(AboutUs);
