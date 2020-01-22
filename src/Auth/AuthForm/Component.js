import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

import { withI18n } from 'localization/helpers';
import { getCurrentLang } from 'locales/helpers';

import Button from 'components/Button';
import ReCaptcha from 'components/ReCaptcha';

import {
  TextField
} from 'components/Form';

import ForgetPassword from './ForgetPassword';

import './styles.sass';

function AuthForm(props) {
  const [isForgotPasswordMode, setForGotPasswordMode] = useState(false);
  const [isRecaptchaSet, setRecaptcha] = useState(false);
  const [agreedWithTerms, setTermsAgreed] = useState(false);

  const {
    i18n,
    formData,
    formErrors,
    isSignInMode,
    handleFormSubmit,
    handleFormChange,
  } = props;

  const isSubmitDisabled = !isSignInMode && (!isRecaptchaSet || !agreedWithTerms);

  const onFormChange = useCallback(data => {
    handleFormChange({
      ...formData,
      ...data,
    });
  }, [formData]);

  const handleRecaptchaSet = useCallback((cKey) => {
    if (cKey) {
      setRecaptcha(true);
    }
  }, []);

  const onFormSubmit = useCallback((e) => {
    e.preventDefault();
    if (isForgotPasswordMode) {

    } else {
      // in case of sign up
      if (isSubmitDisabled) {
        handleFormSubmit(formData);
      } else {
        handleFormSubmit(formData);
      }
    }
  }, [isSubmitDisabled, isForgotPasswordMode, formData]);

  const toggleTermsAgreed = useCallback(() => {
    setTermsAgreed((agreedWithTerms) => !agreedWithTerms);
  }, []);

  return (
    <form
      className="anm-auth-form"
      key={String(isSignInMode)}
      onSubmit={handleFormSubmit}
    >
      {isForgotPasswordMode
        ? (
          <ForgetPassword/>
        )
        : (
          <>
            {!isSignInMode && (
              <>
                <TextField
                  required
                  fullWidth
                  margin="normal"
                  name="firstName"
                  onChange={onFormChange}
                  value={formData.firstName}
                  error={formErrors.firstName}
                  label={i18n('form.firstName')}
                />

                <TextField
                  required
                  fullWidth
                  margin="normal"
                  name="lastName"
                  onChange={onFormChange}
                  value={formData.lastName}
                  error={formErrors.lastName}
                  label={i18n('form.lastName')}
                />
              </>
            )}

            <TextField
              required
              fullWidth
              id="email"
              name="email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={onFormChange}
              error={formErrors.email}
              label={i18n('form.email')}
            />

            <TextField
              required
              fullWidth
              id="password"
              name="password"
              type="password"
              margin="normal"
              onChange={onFormChange}
              value={formData.password}
              error={formErrors.password}
              label={i18n('form.password')}
              helperText={!isSignInMode ? i18n('password.wrongPassword') : ''}
            />

            <div className="mrg-top-15">
              <span
                className="forgot-password-link"
                onClick={setForGotPasswordMode}
              >
                {i18n('form.forgotPass')}
              </span>
            </div>

            {!isSignInMode && (
              <div className="flex-row align-center justify-between mrg-top-15 form-policy-wrapper">
                <div>
                  <Checkbox
                    color="primary"
                    margin="normal"
                    checked={agreedWithTerms}
                    onChange={toggleTermsAgreed}
                  />

                  <span className="terms-agree-checkbox-label-text">
                    {i18n('agreeWith')}
                    {' '}
                    <a
                      target="_blank"
                      href={`/${getCurrentLang()}/terms`}
                      className="anm-link blue-on-hover"
                    >
                      {i18n('termsAndPrivacyPolicyPlural')}
                    </a>
                  </span>
                </div>
                {!isSignInMode && (
                  <ReCaptcha
                    onChange={handleRecaptchaSet}
                  />
                )}
              </div>
            )}
            <div className="auth-form-footer">
              <Button
                type="submit"
                variant="gradient"
                onClick={onFormSubmit}
                disabled={isSubmitDisabled}
              >
                {isSignInMode
                  ? i18n('signIn')
                  : i18n('signUp')}
              </Button>
            </div>
          </>
        )
      }
    </form>
  );
}

AuthForm.defaultProps = {};

AuthForm.propTypes = {
  isSignInMode: PropTypes.bool,
};

export default withI18n(AuthForm);
