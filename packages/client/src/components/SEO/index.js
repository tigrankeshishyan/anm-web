import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { languages} from 'localization/constants';
import lodashXor from 'lodash.xor';
import { siteMetadata } from '_constants';
import {
  getCurrentLang,
} from 'localization/helpers';
import {
  withI18n,
} from 'localization/helpers';

const {
  REACT_APP_HOST,
} = process.env;

const SEO = props => {
  const {
    type,
    i18n,
    title,
    author,
    imageAlt,
    imageUrl,
    children,
    description,
    titleTranslationId,
    descriptionTranslationId,
  } = props;

  const url = window.location.href;
  const locale = getCurrentLang();

  const generatedTitle = titleTranslationId
    ? i18n(titleTranslationId)
    : title;

  const generatedDescription = descriptionTranslationId
    ? i18n(descriptionTranslationId)
    : description;

  const dscr = generatedDescription || siteMetadata.description;
  const titleText = generatedTitle || siteMetadata.title;
  const imgSrc = imageUrl || siteMetadata.image;
  const langs = Object.values(languages).map(l => l.path);
  // get the next language
  // if current 'locale' is 'en' then we xor 'en' from an array
  // and get the next one, which is 'hy' lang in this case
  const oppositeLocale = lodashXor(langs, [locale])[0];
  const oppositeUrl = url.replace(`/${locale}/`, `/${oppositeLocale}/`);

  return (
    <Helmet
      defer={false}
      title={titleText}
      htmlAttributes={{ lang: locale }}
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0',
        },
        {
          'http-equiv': 'cache-control',
          content: 'no-cache',
        },
        {
          'http-equiv': 'expires',
          content: '0',
        },
        {
          'http-equiv': 'pragma',
          content: 'no-cache',
        },
        {
          name: 'charSet',
          content: 'utf-8',
        },
        {
          name: 'author',
          content: author,
        },
        {
          name: 'description',
          content: dscr,
        },
        {
          name: 'keywords',
          content: siteMetadata.keywords,
        },
        // TWITTER
        {
          name: 'twitter:site',
          content: url,
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        {
          name: 'twitter:image',
          content: imgSrc,
        },
        {
          property: 'twitter:image:alt',
          content: imageAlt,
        },
        {
          name: 'twitter:title',
          content: generatedTitle,
        },
        {
          name: 'twitter:description',
          content: dscr,
        },
        // FACEBOOK
        {
          property: 'og:url',
          content: url,
        },
        {
          property: 'og:type',
          content: type,
        },
        {
          property: 'og:image',
          content: imgSrc,
        },
        {
          property: 'og:image:alt',
          content: imageAlt,
        },
        {
          property: 'og:title',
          content: titleText,
        },
        {
          property: 'og:site_name',
          content: REACT_APP_HOST,
        },
      ]}
    >
      <link
        href={url}
        rel="alternate"
        hrefLang={locale}
      />
      <link
        href={oppositeUrl}
        rel="alternate"
        hrefLang={oppositeLocale}
      />
      {children}
    </Helmet>
  );
};

SEO.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  author: PropTypes.string,
  imageUrl: PropTypes.string,
  description: PropTypes.string,
  titleTranslationId: PropTypes.string,
  descriptionTranslationId: PropTypes.string,
};

SEO.defaultProps = {
  type: 'article',
  author: 'ANM Media',
  imageAlt: 'Armenian National Music',
};

export default withI18n(SEO);
