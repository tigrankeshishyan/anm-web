import React from 'react';
import PropTypes from 'prop-types';

import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import Button from 'components/Button';

import { noop } from 'helpers';

function Dialog(props) {
  const {
    open,
    title,
    onClose,
    children,
    onAccept,
    ...dialogProps
  } = props;

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      {...dialogProps}
    >
      {
        open && (
          <>
            {title && (
              <MuiDialogTitle>
                {title}
              </MuiDialogTitle>
            )}

            <MuiDialogContent>
              {children || ''}
            </MuiDialogContent>

            <MuiDialogActions>
              <Button
                variant="ghost-blue"
                onClick={onClose}
              >
                CLOSE
              </Button>
              <Button
                variant="secondary"
                onClick={onAccept}
              >
                OK
              </Button>
            </MuiDialogActions>
          </>
        )
      }
    </MuiDialog>
  );
}

Dialog.defaultProps = {
  open: false,
  onClose: noop,
  onAccept: noop,
  paper: 'paper',
};

Dialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAccept: PropTypes.func,
};

export default Dialog;
