import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  AUTHENTICATE_USER,
} from '_graphql/actions';

import UserMenu from './UserMenu';
import Loading from 'components/Loading';
import AuthNav from './AuthNav';

import './styles.sass';

/**
 * @return {string|Element}
 */
function Auth() {
  const { data: { currentUser } = {}, loading } = useQuery(AUTHENTICATE_USER, {
    notifyOnNetworkStatusChange: true,
  });

  return (
    <div className="anm-user-info-wrapper">
      {currentUser
        ? <UserMenu user={currentUser} />
        : (
          <Loading
            minHeight={30}
            isLoading={loading}
          >
            <AuthNav />
          </Loading>
        )}
    </div>
  );
}

Auth.defaultProps = {};

Auth.propTypes = {};

export default Auth;
