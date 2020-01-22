import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import BlockWithImage from 'components/BlockWithImage';

import './styles.sass';

function PosterWithSectionBlock(props) {
  const {
    url,
  } = props;

  return (
    <Grid
      container
      justify="space-between"
      className="page-title-with-poster"
    >
      <Grid
        item
        md={2}
        xs={12}
        className="flex-column justify-end decoration-block-wrapper"
      >
        <div className="decoration-block" />
      </Grid>

      <Grid
        item
        md={7}
        sm={12}
        xs={12}
      >
        <div className="poster-image-wrapper">
          <BlockWithImage
            url={url}
          />
        </div>
      </Grid>
    </Grid>
  );
}

PosterWithSectionBlock.defaultProps = {
  url: '',
};

PosterWithSectionBlock.propTypes = {
  url: PropTypes.string,
};

export default PosterWithSectionBlock;
