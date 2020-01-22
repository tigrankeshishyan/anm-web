import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import './styles.sass';

/**
 * Basic custom button
 * @param props
 * @returns {*}
 * @constructor
 */
const Button = React.forwardRef((props, ref) => {
  const {
    variant,
    children,
    className,
    ...buttonProps
  } = props;

  return (
    <button
      ref={ref}
      {...buttonProps}
      className={clsx('anm-button', className, variant )}
    >
      {children}
    </button>
  );
});

Button.defaultProps = {
  className: '',
  variant: 'primary',
};

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    'white',
    'success',
    'primary',
    'gradient',
    'secondary',
    'ghost-blue',
  ]),
};

export default Button;
