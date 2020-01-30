import React from 'react';
import PropTypes from 'prop-types';

import ImagesCarousel from 'sections/ImagesCarousel';

import { withI18n } from 'localization/helpers';

import SectionTitle from 'components/SectionTitle';

import './styles.sass';

function NewsGallery(props) {
  const {
    images,
    i18n,
  } = props;

  if (!images || !images.length) {
    return null;
  }

  return (
    <div className="anm-news-gallery-section">
      <SectionTitle
        title={i18n('gallery')}
      />

      <div className="flex-row wrap justify-center anm-news-gallery-section-content">
        <ImagesCarousel
          images={images}
        />
      </div>
    </div>
  );
}

NewsGallery.defaultProps = {
  images: [],
};

NewsGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string,
    caption: PropTypes.string,
  })),
};

export default withI18n(NewsGallery);
