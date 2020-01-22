import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { red, grey } from '@material-ui/core/colors';

const styles = theme => ({
  label: {
    margin: '5px 0',
    display: 'flex',
    color: grey.A200,
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 16,
  },
  required: {
    marginLeft: 5,
    color: red['500'],
  },
});

function Label(props) {
  const {
    label,
    classes,
    labelFor,
    required,
  } = props;

  return (
    <label
      htmlFor={labelFor}
      className={classes.label}
    >
      <span className={classes.labelText}>{label}</span>
      {required && <span className={classes.required}>*</span>}
    </label>
  );
}

Label.propTypes = {
  labelFor: PropTypes.string,
  label: PropTypes.string,
};

Label.defaultProps = {
  label: '',
  labelFor: '',
  required: false,
};

export default withStyles(styles)(Label);
