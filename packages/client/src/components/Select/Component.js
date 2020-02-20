import React from 'react';
import ReactSelect from 'react-select';

import colors from '_constants/colors';

import './styles.sass';

const colorStyles = {
  multiValueRemove: styles => ({
    ...styles,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

function Select(props) {
  const {
    styles,
  } = props;
  
  return (
    <ReactSelect
      {...props}
      classNamePrefix="anm-select"
      menuPortalTarget={document.body}
      styles={{
        ...colorStyles,
        menuPortal: provided => ({
          ...provided,
          ...(styles.menuPortal || {}),
          zIndex: 999999,
        }),
        ...styles,
      }}
    />
  );
}

Select.defaultProps = {
  styles: {},
};

Select.propTypes = {};

export default Select;
