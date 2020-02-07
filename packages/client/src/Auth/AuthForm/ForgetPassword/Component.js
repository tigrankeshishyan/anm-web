import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { withI18n } from 'localization/helpers';

import { TextField } from 'components/Form';
import Button from 'components/Button';
import Loading from 'components/Loading';

import { isEmail } from 'helpers';

import {
  FORGOT_PASSWORD,
} from '_graphql/actions/user';

function ForgetPassword(props) {
  const [state, setState] = useState({ email: '' });
  const [requestStatus, setRequestStatus] = useState(false);
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const {
    i18n,
  } = props;

  const handleEmailChange = useCallback(data => {
    setState(state => ({ ...state, ...data }));
  }, [setState]);

  const handleFormSubmit = useCallback(async event => {
    event.preventDefault();

    const res = await forgotPassword({
      variables: {
        email: state.email,
      },
    });

    if (res) {
      const { forgotPassword: response } = (res.data || {});
      if (response && response.forgotPasswordResult) {
        setRequestStatus(response.forgotPasswordResult.success);
      }
    }
  }, [setRequestStatus, forgotPassword, state]);

  return (
    <Loading isLoading={loading}>
      <form onSubmit={handleFormSubmit} className="mrg-top-15">
        {!requestStatus ? (
          <>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              type="email"
              margin="normal"
              value={state.email}
              label={i18n('form.email')}
              onChange={handleEmailChange}
            />
            <div className="flex-row justify-end mrg-top-15">
              <Button
                type="submit"
                variant="gradient"
                onClick={handleFormSubmit}
                disabled={!isEmail(state.email)}
              >
                {i18n('submit')}
              </Button>
            </div>
          </>
        ) : (
          i18n('forgotPasswordSuccess')
        )}
      </form>
    </Loading>
  );
}

ForgetPassword.defaultProps = {};

ForgetPassword.propTypes = {};

export default withI18n(ForgetPassword);
