import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import BlockWithImage from 'components/BlockWithImage';

import './styles.sass';

const blockHiddenPoints = ['xs', 'sm'];

function PosterWithSectionBlock (props) {
  const {
    url,
    imgAlt,
    hideBlockOnMobile,
  } = props;

  return (
    <Grid
      container
      justify="space-between"
      className="page-title-with-poster"
    >
      <Hidden only={hideBlockOnMobile ? blockHiddenPoints : []}>
        <Grid
          item
          md={2}
          xs={12}
          className="flex-column justify-end decoration-block-wrapper"
        >
          <div className="decoration-block"/>
        </Grid>
      </Hidden>

      {url && (
        <Grid
          item
          md={7}
          sm={12}
          xs={12}
        >
          <div className="poster-image-wrapper">
            <BlockWithImage
              url={url}
              imgAlt={imgAlt}
            />
          </div>
        </Grid>
      )}
    </Grid>
  );
}

PosterWithSectionBlock.defaultProps = {
  url: '',
  imgAlt: undefined,
  hideBlockOnMobile: false,
};

PosterWithSectionBlock.propTypes = {
  url: PropTypes.string,
  imgAlt: PropTypes.string,
  hideBlockOnMobile: PropTypes.bool,
};

export default PosterWithSectionBlock;
