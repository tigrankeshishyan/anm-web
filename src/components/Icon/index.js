import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import MUIIcon from '@material-ui/core/Icon';

import './styles.sass';

const iconColors = {
  red: 'red',
  blue: 'blue',
};

function Icon(props) {
  const {
    type,
    classes,
    onClick,
    children,
    className,
    disabled,
    hoverColor,
    ...iconProps
  } = props;

  const iconClassName = clsx('anm-icon', className, {
    'pointer': !!onClick,
    'red-on-hover' : hoverColor === iconColors.red,
    'blue-on-hover' : hoverColor === iconColors.blue,
    disabled,
  });

  return (
    <MUIIcon
      {...iconProps}
      className={iconClassName}
      onClick={event => !disabled && onClick(event)}
    >
      {type || children}
    </MUIIcon>
  );
}

Icon.defaultProps = {
  hoverColor: iconColors.blue,
};

Icon.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  hoverColor: PropTypes.oneOf([iconColors.red, iconColors.blue]),
};

export default Icon;
