import React from 'react';

import Loading from 'components/Loading';

import { withToastActions } from 'containers/ToastMessages';
import { withI18n } from 'localization/helpers';

import { useQuery } from '@apollo/react-hooks';

import { AUTHENTICATE_USER } from '_graphql/actions/user';

const withUser = Comp => withToastActions(withI18n(props => {
  const {
    error,
    loading,
    data: userData = {},
  } = useQuery(AUTHENTICATE_USER);
  const user = userData.currentUser || {};

  if (error) {
    return 'user error';
  }

  if (loading) {
    return (
      <Loading
        minHeight={30}
        isLoading={loading}
      />
    );
  }

  const {
    i18n,
    addToastMessage,
  } = props;

  const userShouldBeLoggedIn = () => {
    if (!user || !user.email) {
      addToastMessage.error(i18n('forRegisteredUsers'));
      return false;
    }
    return true;
  };

  return (
    <Comp
      {...props}
      user={user}
      userShouldBeLoggedIn={userShouldBeLoggedIn}
    />
  );
}));

export default withUser;
