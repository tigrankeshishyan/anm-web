import React, { useCallback } from 'react';
import lodashGet from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';

import ContactForm from 'sections/ContactUsForm';
import ContentSection from 'sections/ContentSection';
import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import SEO from 'components/SEO';
import PageTitle from 'components/PageTitle';
import SocialIcons from 'components/SocialIcons';
import TitleWithInfo from 'components/TitleWithInfo';

import { FETCH_SINGLE_PAGE_SECTION } from '_graphql/actions/pageSections';

import { isEmail } from 'helpers';
import { withI18n } from 'localization/helpers';

import './styles.sass';

const supportEmail = 'support@anmmedia.am';

const fields = [
  {
    name: 'name',
    labelFor: 'contactUs.name',
  },
  {
    labelFor: 'contactUs.email',
    name: 'email',
    inputProps: {
      required: true,
      type: 'email',
    },
  },
  {
    labelFor: 'contactUs.message',
    name: 'message',
    inputProps: {
      required: true,
      multiline: true,
      rows: 5,
    },
  },
];

const anmEmails = [
  supportEmail,
  'info@anmmedia.am',
  'press@anmmedia.am',
];

const anmPhone = '+37441900014';

const generateEmailLink = email => (
  <a
    target="_blank"
    href={`mailto:${email}`}
    rel="noopener noreferrer"
    className="anm-link primary"
  >
    {email}
  </a>
);

// 'title' property will be used for translations
// NOTE: please be careful when changing the sort of this array
// THE SEO description is based on that values (check render method)
const getInfos = (i18n) => [
  {
    title: 'address',
    infos: i18n('anmAddress'),
  },
  {
    title: 'email',
    infos: anmEmails.map(generateEmailLink),
  },
  {
    title: 'phoneNumber',
    infos: (
      <a
        target="_blank"
        href={`tel:${anmPhone}`}
        rel="noopener noreferrer"
        className="anm-link primary"
      >
        {anmPhone}
      </a>
    ),
  },
];

/**
 * @param props
 * @returns {*}
 * @constructor
 */
function ContactUs(props) {
  const { data = {}} = useQuery(FETCH_SINGLE_PAGE_SECTION, {
    variables: {
      name: 'images',
      page: 'contactUs',
    },
  });
  const {
    i18n,
  } = props;

  const validateForm = useCallback(data => {
    return !!data.message && !!data.message.trim() && isEmail(data.email);
  }, []);

  const infos = getInfos(i18n);
  const descriptionText = `
    ${i18n('email')} - ${supportEmail}
    ${i18n('address')} - ${i18n('anmAddress')}
    ${i18n('phoneNumber')} - ${anmPhone}
  `;

  const pagePosterUrl = lodashGet(data.pageSection, 'attrs.pagePosterUrl', '');

  return (
    <>
      <SEO
        imageUrl={pagePosterUrl}
        description={descriptionText}
        titleTranslationId="contactUs"
      />

      <PosterWithSectionBlock
        hideBlockOnMobile
        url={pagePosterUrl}
      />

      <ContentSection>
        <Grid container>
          <Grid
            item
            md={6}
            xs={12}
          >
            <PageTitle
              title={i18n('contactUs')}
            />

            <div className="mrg-top-15">
              {infos.map((info, index) => (
                <TitleWithInfo
                  {...info}
                  key={index}
                  title={i18n(info.title)}
                />
              ))}
            </div>
            <b className="font-bold">
              {i18n('followUs')}
            </b>
            <SocialIcons
              type="primary"
              className="mrg-top-15 pad-sides-10 justify-start"
            />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
          >
            <div className="mrg-top-15">
              <ContactForm
                fields={fields}
                validateForm={validateForm}
                title={i18n('contactUs.haveQuestions')}
                submitButtonText={i18n('sendButtonText')}
              />
            </div>
          </Grid>
        </Grid>
      </ContentSection>
    </>
  );
}

ContactUs.defaultProps = {};

ContactUs.propTypes = {};

export default withI18n(ContactUs);
