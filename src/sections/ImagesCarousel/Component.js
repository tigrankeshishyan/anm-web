import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { ReactBnbGallery } from 'react-bnb-gallery';

import { addImageProportions } from 'helpers/images';

import Img from 'components/Img';

import 'react-bnb-gallery/dist/style.css';
import './styles.sass';

function ImagesCarousel(props) {
  const [isModalOpen, setModalOpenStatus] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const {
    images,
  } = props;

  const openModal = useCallback(() => {
    setModalOpenStatus(true);
  }, [setModalOpenStatus]);

  const closeModal = useCallback(() => {
    setModalOpenStatus(false);
  }, [setModalOpenStatus]);

  const handleImageSelect = useCallback(imageIndex => {
    setSelectedImageIndex(imageIndex);
    openModal();
  }, [openModal, setSelectedImageIndex]);

  const photos = images.map(image => ({
    photo: image.url,
    thumbnail: addImageProportions(image.url, 100, 100),
  }));

  return (
    <div className="anm-images-carousel">
      <div className="flex-row wrap justify-center align-center">
        {images.map((image, index) => (
          <div
            key={String(index)}
            className="preview-image-wrapper flex-row align-center justify-center"
          >
            <Img
              className="preview-image"
              onClick={() => handleImageSelect(index)}
              src={addImageProportions(image.url, 350, 200)}
            />
          </div>
        ))}
      </div>

      <ReactBnbGallery
        photos={photos}
        preloadSize={10}
        show={isModalOpen}
        onClose={closeModal}
        activePhotoIndex={selectedImageIndex}
      />
    </div>
  );
}

ImagesCarousel.defaultProps = {
  images: [],
  imageClassName: '',
  legendClassName: '',
  carouselClassName: '',
};

ImagesCarousel.propTypes = {
  imageClassName: PropTypes.string,
  legendClassName: PropTypes.string,
  carouselClassName: PropTypes.string,
};

export default ImagesCarousel;
