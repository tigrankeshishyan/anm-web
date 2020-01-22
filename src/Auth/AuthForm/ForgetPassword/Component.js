import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { withI18n } from 'localization/helpers';

import { TextField } from 'components/Form';
import Button from 'components/Button';
import Loading from 'components/Loading';

import { isEmail } from 'helpers';

import {
  FORGET_PASSWORD,
} from '_graphql/actions/user';

// import './styles.sass';

function ForgetPassword(props) {
  const [state, setState] = useState({ email: '' });
  const [requestStatus, setRequestStatus] = useState(false);
  const [forgetPassword, { loading }] = useMutation(FORGET_PASSWORD);

  const {
    i18n,
    addToastMessage,
  } = props;

  const handleEmailChange = useCallback(data => {
    setState(state => ({ ...state, ...data }));
  }, [setState]);

  const handleFormSubmit = useCallback(async event => {
    event.preventDefault();

    const res = await forgetPassword({
      variables: {
        email: state.email,
      },
    });

    if (res && res.data && res.data.forgetPassword) {
      setRequestStatus(res.data.forgetPassword.success);
    }
  }, [addToastMessage, forgetPassword, state]);

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
