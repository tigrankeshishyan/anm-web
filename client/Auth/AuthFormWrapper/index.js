import React, { useCallback, useState, useEffect } from 'react';

import { useMutation } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';

import { withToastActions } from 'containers/ToastMessages';

import ContentSection from 'sections/ContentSection';

import SEO from 'components/SEO';
import SocialIcon from 'components/SocialIcon';

import { validateForm } from 'Auth/helpers';
import { withI18n } from 'localization/helpers';

import { getCurrentLang } from 'locales/helpers';

import {
  LOG_IN,
  CREATE_USER,
  AUTHENTICATE_USER,
} from '_graphql/actions/user';

import Loading from 'components/Loading';
import AuthForm from 'Auth/AuthForm';

import './styles.sass';

const {
  REACT_APP_API,
} = process.env;

const emptySignInForm = {
  email: '',
  password: '',
};

const emptySignUpForm = {
  email: '',
  password: '',
  lastName: '',
  firstName: '',
  confirmPassword: '',
};

const DUPLICATE_EMAIL_ERROR = 'duplicate key value';

const loginRequiredFields = [
  'password',
  'email',
];

const requiredFields = [
  'firstName',
  'lastName',
];

const getResponseStatusKey = code => {
  switch (code) {
    case 2:
      return 'useFacebook';
    case 1:
    default:
      return 'wrongCredentials';
  }
};

const locale = getCurrentLang();

function AuthFormWrapper(props) {
  const [formKey, setFormKey] = useState('form');
  const [formData, setFormData] = useState(emptySignUpForm);
  const [isSignInMode, setSignInMode] = useState(true);
  const [isPageLoading, setPageLoading] = useState(false);
  const [formErrors, setErrors] = useState([]);

  const [createUser, { loading: isCreateUserLoading, error: userCreateError }] = useMutation(CREATE_USER);
  const [logIn, { loading: isLoginLoading }] = useMutation(LOG_IN);

  useEffect(() => {
    const errors = {};
    if (userCreateError) {
      if (userCreateError.message && userCreateError.message.includes(DUPLICATE_EMAIL_ERROR)) {
        errors.email = props.i18n('email.duplicateEmailError');
        props.addToastMessage.error(errors.email);
        setErrors(errors);
      }
    }
  }, [props, setErrors, createUser, userCreateError]);

  useEffect(() => {
    const isSignInMode = props.location.pathname.includes('sign-in');
    const formData = isSignInMode ? emptySignInForm:emptySignUpForm;

    setFormData(formData);
    setSignInMode(isSignInMode);
    setFormKey(formKey);
  }, [props, formKey, setFormKey, setSignInMode, setFormData]);

  const {
    i18n,
    history,
    addToastMessage,
  } = props;

  const handleFormSubmit = useCallback(async data => {
    const fields = isSignInMode
      ? loginRequiredFields
      :[...loginRequiredFields, ...requiredFields];

    const errors = validateForm(data, fields, i18n);

    if (!Object.keys(errors).length) {
      // Log in user or create a new one
      const res = isSignInMode
        ? await logIn({
          variables: data,
          refetchQueries: [{ query: AUTHENTICATE_USER }],
        })
        :await createUser({ variables: data });

      if (res && res.data) {
        const {
          createUser,
        } = res.data;

        const {
          errorCode,
        } = (res.data.login || {});

        // if createUser exists that means that user just was created
        if (createUser) {
          addToastMessage.success(i18n('profileCreated'));
          history.push(`${locale}/auth/sign-in`);
        } else if (errorCode) {
          addToastMessage.error(i18n(getResponseStatusKey(errorCode)));
        } else {
          setFormData(emptySignUpForm);
          history.push(`${locale}/home`);
        }
      }
    }
    setErrors(errors);
  }, [
    i18n,
    logIn,
    history,
    setErrors,
    createUser,
    setFormData,
    isSignInMode,
    addToastMessage,
  ]);

  return (
    <>
      <SEO
        title={i18n(isSignInMode ? 'signIn':'signUp')}
      />

      <ContentSection>
        <Grid container justify="center">
          <Grid
            item
            sm={6}
            xs={12}
          >
            <Loading
              className="mrg-top-15"
              isLoading={isPageLoading || isCreateUserLoading || isLoginLoading}
            >
              <p className="secondary-text-color mrg-vertical-half">
                {i18n('useSocialAccount')}
              </p>

              <a
                onClick={() => setPageLoading(true)}
                href={`${REACT_APP_API}/auth/facebook`}
              >
                <SocialIcon iconName="Facebook"/>
              </a>

              <AuthForm
                key={formKey}
                formData={formData}
                formErrors={formErrors}
                isSignInMode={isSignInMode}
                handleFormChange={setFormData}
                handleFormSubmit={handleFormSubmit}
              />
            </Loading>
          </Grid>
        </Grid>
      </ContentSection>
    </>
  );
}

AuthFormWrapper.defaultProps = {};

AuthFormWrapper.propTypes = {};

export default withI18n(withToastActions(AuthFormWrapper));
