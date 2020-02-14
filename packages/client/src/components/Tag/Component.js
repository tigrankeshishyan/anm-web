import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

import './styles.sass';

function Tag(props) {
  const {
    text,
    onClick,
    onRemove,
    className,
  } = props;
  
  if (!text) {
    return null;
  }
  
  return (
    <div
      onClick={onClick}
      className={clsx('anm-tag font-bold', { 'has-onClick': onClick }, className)}
    >
      {text}
      
      {
        onRemove && (
          <CloseIcon className="anm-icon tag-remove-icon pointer" onClick={onRemove} />
        )
      }
    </div>
  );
}

Tag.defaultProps = {
  text: '',
  onClick: null,
};

Tag.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Tag;
