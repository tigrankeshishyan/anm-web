import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import Label from 'components/Form/Label';
import FormSelect from 'components/Select';

import { noop } from 'helpers';

function Select(props) {
  const {
    name,
    label,
    value,
    margin,
    variant,
    isMulti,
    options,
    required,
    dataLang,
    fullWidth,
    helperText,
    className,
    ...selectProps
  } = props;

  const defaultValue = isMulti
    ? Array.isArray(value)
      ? value
      : []
    : value;

  const selectedOptions = isMulti
    ? options.filter(opt => defaultValue.includes(opt.value))
    : options.find(opt => opt.value === defaultValue);

  return (
    <FormControl
      name={name}
      margin={margin}
      variant={variant}
      required={required}
      fullWidth={fullWidth}
      className={className}
    >
      {
        label && (
          <Label
            labelFor={label}
            required={required}
            label={`${label} ${dataLang}`}
          />
        )
      }

      <FormSelect
        id={label}
        name={name}
        {...selectProps}
        isMulti={isMulti}
        options={options}
        value={selectedOptions}
        closeMenuOnSelect={!isMulti}
        aria-describedby={`describe-${label}`}
        onChange={(val, option) => {
          let selectedValue = isMulti ? [] : null;

          if (val !== null) {
            selectedValue = isMulti ? val.map(el => el.value) : val.value;
          }

          selectProps.onChange({ [name]: selectedValue }, name, { selectedValue, val, option, dataLang });
        }}
      />
      {helperText && (
        <FormHelperText
          id={`describe-${label}`}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

Select.defaultProps = {
  variant: 'outlined',
  margin: 'normal',
  onChange: noop,
  fullWidth: true,
  required: false,
  helperText: '',
  dataLang: '',
  options: [],
  label: '',
  name: '',
};

Select.propsTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.string,
  onChange: PropTypes.func,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({})),
};

export default Select;
