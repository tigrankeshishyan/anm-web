import React from 'react';
import get from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SEO from 'components/SEO';
import PageTitle from 'components/PageTitle';
import ShareOnSocial from 'components/ShareOnSocial';

import PosterWithSectionBlock from 'sections/PosterWithSectionBlock';

import moment from 'helpers/date';

import {
  FETCH_SINGLE_MUSICIAN,
} from '_graphql/actions/musicians';

import './styles.sass';

const dateFormat = 'MMM DD YYYY';

const formatDate = date => date ? moment(date).format(dateFormat) : '';
function MusicianDetails(props) {
  const { data: { musician = {} } = {} } = useQuery(FETCH_SINGLE_MUSICIAN, {
    variables: {
      id: Number(props.match.params.musicianId),
    },
  });

  const musicianPhoto = get(musician, 'photo.url', '');
  const firstName = get(musician, 'firstName', '');
  const lastName = get(musician, 'lastName', '');
  const professions = get(musician, 'professions', []);
  const musicianProfessions = professions.map(p => p.profession.name).join(', ');
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

      <Grid container>
        <Grid
          item
          xs={12}
          className="content-wrapper"
        >
          <PageTitle
            className="pad-sides-10"
            title={musicianFullName}
          />

          <Typography
            color="textSecondary"
            className="pad-sides-10"
          >
            {musicianProfessions}
          </Typography>
          <Typography
            color="textSecondary"
            className="pad-sides-10"
          >
            {`${formatDate(musician.birthday)} ${formatDate(musician.deathday)}`}
          </Typography>

          <div
            className="break-word mrg-top-15 pad-10"
            dangerouslySetInnerHTML={{ __html: biography }}
          />

          <ShareOnSocial />

        </Grid>
      </Grid>
    </>
  );
}

export default MusicianDetails;
