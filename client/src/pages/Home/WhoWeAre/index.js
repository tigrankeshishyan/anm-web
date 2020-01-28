import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SectionTitle from 'components/SectionTitle';

import { withI18n } from 'localization/helpers';

import WhoWeAreGallery from './Gallery';

import './styles.sass';

function WhoWeAre(props) {
  const {
    i18n,
    images,
  } = props;

  return (
    <Grid
      container
      className="anm-home-who-we-are"
    >
      <Grid
        item
        md={6}
        xs={12}
      >
        <div className="mrg-bottom-15">
          <div className="flex-column who-we-are-info-block">
            <Typography
              variant="h5"
              className="text-center who-we-are-title"
            >
              <b>
                {i18n('home.whoWeAre')}
              </b>
            </Typography>

            <Typography
              variant="body1"
              className="who-we-are-body"
            >
              {i18n('home.whoWeAreText')}
            </Typography>
          </div>

          <SectionTitle
            type="short"
            position="left"
            linkTo="/about-us"
            linkTitle={i18n('moreAboutUs')}
          />
        </div>
      </Grid>

      <Grid
        item
        md={6}
        xs={12}
        className="flex-column justify-end who-we-are-gallery"
      >
        <div className="gallery-section flex-row justify-end">
          <WhoWeAreGallery autoPlay images={images}/>
        </div>

        <div className="block-background"/>
      </Grid>
    </Grid>
  );
}

WhoWeAre.defaultProps = {};

WhoWeAre.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default withI18n(WhoWeAre);
