import React from 'react';
import get from 'lodash.get';
import moment from 'helpers/date';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SEO from 'components/SEO';
import PageTitle from 'components/PageTitle';
import SocialShareIcons from 'components/SocialShareIcons';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import './styles.sass';

const dateFormat = 'MMM DD YYYY';

function MusicianDetails(props) {
  const {
    pageContext,
  } = props;

  const { musician } = pageContext;

  const musicianPhoto = get(musician, 'photo.url', '');
  const firstName = get(musician, 'firstName', '');
  const lastName = get(musician, 'lastName', '');
  const biography = musician.biography || '';
  const musicianFullName = `${firstName || ''} ${lastName || ''}`;

  return (
    <>
      <SEO
        imageUrl={musicianPhoto}
        title={musicianFullName}
        author={musicianFullName}
        url={pageContext.pageUrl}
        locale={pageContext.locale}
        description={musicianFullName}
      />

      <PosterWithSectionBlock
        url={musicianPhoto}
      />

      <Grid
        container
      >
        <Grid
          item
          xs={12}
          className="content-wrapper"
        >
          <PageTitle
            title={musicianFullName}
            className="pad-sides-10"
          />

          <Typography
            color="textSecondary"
            className="pad-sides-10"
          >
            {`${moment(musician.birthday).format(dateFormat)} ${musician.deathday ? moment(musician.deathday).format(dateFormat) : ''}`}
          </Typography>

          <div
            className="break-word mrg-top-15 pad-10"
            dangerouslySetInnerHTML={{ __html: biography }}
          />

          <div className="mrg-top-15">
            <SocialShareIcons/>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default MusicianDetails;
