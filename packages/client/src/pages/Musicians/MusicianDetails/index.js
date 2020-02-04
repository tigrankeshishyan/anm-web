import React from 'react';
import get from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SEO from 'components/SEO';
import PageTitle from 'components/PageTitle';
import SocialShareIcons from 'components/SocialShareIcons';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import moment from 'helpers/date';

import {
  FETCH_SINGLE_MUSICIAN,
} from '_graphql/actions/musicians';

import './styles.sass';

const dateFormat = 'MMM DD YYYY';

function MusicianDetails(props) {
  const { data: { musician = {} } = {} } = useQuery(FETCH_SINGLE_MUSICIAN, {
    variables: {
      id: Number(props.match.params.musicianId),
    },
  });

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
        description={musicianFullName}
      />

      <PosterWithSectionBlock
        hideBlockOnMobile
        url={musicianPhoto}
        imgAlt={musicianFullName}
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
