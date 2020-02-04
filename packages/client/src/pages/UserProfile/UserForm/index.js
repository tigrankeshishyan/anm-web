import React, { useCallback, useState, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { validateForm } from 'Auth/helpers';

import Loading from 'components/Loading';
import Button from 'components/Button';
import {
  TextField,
} from 'components/Form';

import withUser from 'hoc/withUser';

import { UPDATE_USER } from '_graphql/actions/user';

import { withI18n } from 'localization/helpers';

const requiredFields = [
  'firstName',
  'lastName',
  'email',
];

function UserForm(props) {
  const [userData, setUserData] = useState({});
  const [formErrors, setErrors] = useState({});
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);

  useEffect(() => {
    setUserData(props.user);
  }, [props.user]);

  const {
    i18n,
  } = props;

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();

    const errors = validateForm(userData, requiredFields, i18n);

    if (!Object.keys(errors).length) {
      return updateUser({
        variables: userData,
      });
    }
    setErrors(errors);
  }, [i18n, updateUser, setErrors, userData]);

  const handleFormChange = useCallback((data, { name }) => {
    // Currently email change is not available
    // TODO: add email confirmation for register and for email change
    if (name === 'email') {
      return;
    }

    setUserData({
      ...userData,
      ...data,
    });
  }, [setUserData, userData]);

  return (
    <Loading isLoading={updateUserLoading}>
      <form
        onSubmit={handleFormSubmit}
      >
        <TextField
          required
          fullWidth
          margin="normal"
          name="firstName"
          onChange={handleFormChange}
          error={formErrors.firstName}
          label={i18n('form.firstName')}
          value={userData.firstName || ''}
        />

        <TextField
          required
          fullWidth
          name="lastName"
          margin="normal"
          error={formErrors.lastName}
          onChange={handleFormChange}
          label={i18n('form.lastName')}
          value={userData.lastName || ''}
        />

        <TextField
          required
          disabled
          fullWidth
          name="email"
          margin="normal"
          error={formErrors.email}
          label={i18n('form.email')}
          onChange={handleFormChange}
          value={userData.email || ''}
        />

        <div className="flex-row justify-end">
          <Button
            type="submit"
            variant="gradient"
            className="mrg-top-15"
            onClick={handleFormSubmit}
          >
            {i18n('save')}
          </Button>
        </div>
      </form>
    </Loading>
  );
}

UserForm.defaultProps = {};

UserForm.propTypes = {};

export default withI18n(withUser(UserForm));
