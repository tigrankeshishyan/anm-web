import React from 'react';
import PropTypes from 'prop-types';
import MUITextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Label from 'components/Form/Label';

function TextField(props) {
  const {
    name,
    error,
    label,
    margin,
    dataLang,
    required,
    fullWidth,
    className,
    helperText,
    inputLabelProps,
    ...inputProps
  } = props;

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    props.onChange({
      [name]: value,
    }, name, { value, dataLang, event });
  }

  return (
    <FormControl
      name={name}
      error={!!error}
      margin={margin}
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
            {...inputLabelProps}
          />
        )
      }
      <MUITextField
        name={name}
        error={!!error}
        {...inputProps}
        onChange={handleChange}
      />

      {(error || helperText) && (
        <FormHelperText
          id={`describe-${label}`}
        >
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

TextField.defaultProps = {
  name: '',
  label: '',
  error: '',
  dataLang: '',
  helperText: '',
  fullWidth: true,
  required: false,
  margin: 'normal',
  inputLabelProps: {},
};

TextField.propTypes = {
  name: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  margin: PropTypes.string,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.string,
  inputLabelProps: PropTypes.shape({}),
};

export default TextField;
