import React, { useState, useCallback } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { TextField } from 'components/Form';
import Loading from 'components/Loading';
import Button from 'components/Button';

import { isCorrectPassword } from 'helpers';
import { withI18n } from 'localization/helpers';
import { withToastActions } from 'containers/ToastMessages';

import { getCurrentLang } from 'locales/helpers';

import {
  RESET_PASSWORD,
} from '_graphql/actions/user';

const defaultState = {
  password: '',
  newPassword: '',
};

const locale = getCurrentLang();

function ResetPassword(props) {
  const [state, setState] = useState(defaultState);
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const {
    i18n,
    history,
    addToastMessage,
  } = props;

  const { token } = props.match.params;

  const handleInputChange = useCallback(data => {
    setState(state => ({ ...state, ...data }));
  }, [setState]);

  const handleFormSubmit = useCallback(async event => {
    event.preventDefault();

    const {
      password,
      newPassword,
    } = state;

    if (password.trim() && newPassword.trim()) {
      if (password !== newPassword) {
        addToastMessage.error(i18n('passwordMismatch'));
        return;
      }

      if (!isCorrectPassword(password) || !isCorrectPassword(newPassword)) {
        addToastMessage.error(i18n('password.wrongPassword'));
        return;
      }

      try {
        const res = await resetPassword({
          variables: {
            token,
            newPassword,
          },
        });

        if (res && res.data) {
          if (res.data.errors) {
            addToastMessage.error(i18n('somethingWrong'));
            console.error(res.data.errors);
          } else if (res.data.resetPassword) {
            setState(defaultState);
            addToastMessage.success(i18n('passwordResetSuccess'));
            await history.push(`${locale}/auth/sign-in`);
          }
        }
      } catch (error) {
        addToastMessage.error(i18n('somethingWrong'));
      }
    }
  }, [history, token, state, i18n, resetPassword, setState, addToastMessage]);

  return (
    <Loading isLoading={loading}>
      <div className="reset-pass-form-wrapper">
        <form
          onSubmit={handleFormSubmit}
          className="mrg-top-15 pad-20"
        >
          <TextField
            required
            fullWidth
            id="password"
            name="password"
            type="password"
            margin="normal"
            value={state.email}
            onChange={handleInputChange}
            label={i18n('form.password')}
          />
          <TextField
            required
            fullWidth
            type="password"
            margin="normal"
            id="newPassword"
            name="newPassword"
            value={state.email}
            onChange={handleInputChange}
            label={i18n('form.newPassword')}
          />
          <div className="flex-row justify-end mrg-top-15">
            <Button
              type="submit"
              variant="gradient"
              onClick={handleFormSubmit}
              disabled={!(state.password && state.newPassword)}
            >
              {i18n('submit')}
            </Button>
          </div>
        </form>
      </div>
    </Loading>
  );
}

export default withI18n(
  withToastActions(
    ResetPassword
  )
);
