import React from 'react';
import lodashGet from 'lodash.get';

import BlockWithImage from 'components/BlockWithImage';
import SEO from 'components/SEO';

import HomePartnersSection from 'sections/Partners';

import { withI18n } from 'localization/helpers';

import HomeLatestNewsSection from './HomeNews';
import WhoWeAre from './WhoWeAre';

function HomePage(props) {
  const {
    pageContext,
  } = props;

  const pagePosterUrl = lodashGet(pageContext.sectionData, 'attrs.pagePosterUrl', '');
  const sliderImages = lodashGet(pageContext.sectionData, 'attrs.slider', []);

  return (
    <>
      <SEO
        imageUrl={pagePosterUrl}
        url={pageContext.pageUrl}
        locale={pageContext.locale}
        title="Armenian National Music"
        descriptionTranslationId="aboutUs.info"
      />

      <BlockWithImage
        url={pagePosterUrl}
      />

      <WhoWeAre images={sliderImages} />
      <HomeLatestNewsSection />
      <HomePartnersSection />
    </>
  );
}

export default withI18n(HomePage);
