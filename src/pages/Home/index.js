import React from 'react';
import lodashGet from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import BlockWithImage from 'components/BlockWithImage';
import SEO from 'components/SEO';

import HomePartnersSection from 'sections/Partners';

import { withI18n } from 'localization/helpers';

import {
  FETCH_SINGLE_PAGE_SECTION,
} from '_graphql/actions';

import HomeLatestNewsSection from './HomeNews';
import WhoWeAre from './WhoWeAre';

function HomePage() {
  const { data = {} } = useQuery(FETCH_SINGLE_PAGE_SECTION, {
    variables: {
      page: 'home',
      name: 'images',
    },
  });

  const pagePosterUrl = lodashGet(data.sectionData, 'attrs.pagePosterUrl', '');
  const sliderImages = lodashGet(data.sectionData, 'attrs.slider', []);

  return (
    <>
      <SEO
        imageUrl={pagePosterUrl}
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
