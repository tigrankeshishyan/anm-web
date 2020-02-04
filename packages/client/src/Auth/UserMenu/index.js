import React, { useState, useCallback, useRef } from 'react';
import Popover from '@material-ui/core/Popover';
import { useMutation } from '@apollo/react-hooks';
import { withI18n } from 'localization/helpers';
import Loading from 'components/Loading';
import Link from 'components/Link';

import {
  LOGOUT,
  AUTHENTICATE_USER,
} from '_graphql/actions';

import {
  USER_PROFILE,
} from 'localization/constants';

import './styles.sass';

const popoverProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};

function UserMenu(props) {
  const [isPopoverOpen, setPopoverOpenStatus] = useState(false);
  const [logOut, { loading }] = useMutation(LOGOUT, {
    refetchQueries: [{ query: AUTHENTICATE_USER }],
    notifyOnNetworkStatusChange: true,
  });

  const anchorEl = useRef();

  const {
    user,
    i18n,
  } = props;

  const openPopover = useCallback((e) => {
    setPopoverOpenStatus(true);
  }, [setPopoverOpenStatus]);

  const closePopover = useCallback(() => {
    setPopoverOpenStatus(false);
  }, [setPopoverOpenStatus]);

  const handleLogout = useCallback(() => {
    closePopover();
    return logOut();
  }, [logOut, closePopover]);

  return (
    <>
      <Loading isLoading={loading} minHeight={30}>
        <div
          ref={anchorEl}
          onClick={openPopover}
          className="logged-user-data-wrapper"
        >
        <span
          className="user-name anm-navigation-item pointer"
        >
          {user.firstName}
        </span>
        </div>
      </Loading>

      <Popover
        {...popoverProps}
        open={isPopoverOpen}
        onClose={closePopover}
        anchorEl={anchorEl.current}
      >
        <ul className="popover-user-menu">
          <Link
            to="/user-profile"
            onClick={closePopover}
          >
            <li>
              {i18n(`${USER_PROFILE}.profile`)}
            </li>
          </Link>
          <li
            onClick={handleLogout}
            className="user-logout-item"
          >
            {i18n('logout')}
          </li>
        </ul>
      </Popover>
    </>
  );
}

UserMenu.defaultProps = {};

UserMenu.propTypes = {};

export default withI18n(UserMenu);
