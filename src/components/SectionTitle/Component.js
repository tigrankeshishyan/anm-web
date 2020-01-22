import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';

import SeeMoreLink from 'components/SeeMoreLink';

import { elementType } from 'types';

import './styles.sass';

function SectionTitle(props) {
  const {
    textStyles,
    blockWidth,
    linkTitle,
    position,
    linkTo,
    style,
    title,
    type,
  } = props;

  return (
    <div
      className={clsx(
        'anm-section-title flex-row',
        type,
        `position-${position}`,
      )}
      style={style}
    >
      <div className="section-block" style={{ width: blockWidth }}>
        <Typography
          className="title-text font-bold"
          style={textStyles}
          variant="h5"
        >
          {title}

          {linkTo && (
            <SeeMoreLink
              linkTo={linkTo}
              title={linkTitle}
            />
          )}
        </Typography>
      </div>
    </div>
  );
}

SectionTitle.defaultProps = {
  style: {},
  linkTo: null,
  linkTitle: '',
  type: 'normal',
  textStyles: {},
  position: 'left',
  blockWidth: null,
};

SectionTitle.propTypes = {
  title: elementType,
  linkTitle: elementType,
  linkTo: PropTypes.string,
  position: PropTypes.oneOf(['right', 'left']),
  type: PropTypes.oneOf(['short', 'normal']),
  blockWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default SectionTitle;
