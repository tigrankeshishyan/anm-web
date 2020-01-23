import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SnackbarProvider, withSnackbar } from 'notistack';

import colors from '_constants/colors';

/**
 * "notistick" requires to pass "classes" object to override the styles of messages
 * @param props
 * @returns {*}
 * @constructor
 */

const messageTextColor = 'white';

const styles = {
  variantSuccess: {
    backgroundColor: colors.green,
    color: messageTextColor,
  },
  variantError: {
    backgroundColor: colors.red,
    color: messageTextColor,
  },
  variantWarning: {
    backgroundColor: colors.orange,
    color: messageTextColor,
  },
};

const anchorOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

function ToastMessages(props) {
  const {
    children,
    classes,
  } = props;

  return (
    <SnackbarProvider
      disableWindowBlurListener
      maxSnack={5}
      classes={classes}
      anchorOrigin={anchorOrigin}
    >
      {children}
    </SnackbarProvider>
  );
}

const defaultOptions = {
  preventDuplicate: true,
  autoHideDuration: 5000,
};

export const withToastActions = Comp => withSnackbar(props => {
  const {
    enqueueSnackbar,
    ...compProps
  } = props;

  const actions = {
    error(message, options) {
      enqueueSnackbar(message, {
        variant: 'error',
        ...defaultOptions,
        ...options,
      });
    },
    success(message, options) {
      enqueueSnackbar(message, {
        variant: 'success',
        ...defaultOptions,
        ...options,
      });
    },
    warning(message, options) {
      enqueueSnackbar(message, {
        variant: 'warning',
        ...defaultOptions,
        ...options,
      });
    },
  };

  return <Comp {...compProps} addToastMessage={actions}/>;
});

ToastMessages.defaultProps = {};

ToastMessages.propTypes = {};

export default withStyles(styles)(ToastMessages);
