import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';

import routes from 'routes';

import NavMenuItem from './MenuItem';

import './styles.sass';

const menuItems = routes.filter(r => r.isMain);

function NavigationMenu(props) {
  const {
    location,
    iseMenuOpen,
    setMenuOpenStatus,
  } = props;

  return (
    <div className="flex-row grow horizontal-nav-menu anm-navigation-wrapper">
      <Hidden mdUp>
        <div
          className="mobile-icon"
          onClick={() => setMenuOpenStatus(!iseMenuOpen)}
        >
          {iseMenuOpen
            ? <CloseIcon className="anm-icon" />
            : <MenuIcon className="anm-icon" />}
        </div>
      </Hidden>
      <nav className="anm-navigation-menu">
        <ul className="reset-list-styles">
          {menuItems.map((menuItem) => {
            const isActive = location && location.pathname.includes(menuItem.path);
            return (
              <NavMenuItem
                {...menuItem}
                key={menuItem.key}
                isActive={isActive}
                path={menuItem.linkPath}
                onClick={() => setMenuOpenStatus(false)}
              />
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

NavigationMenu.defaultProps = {
  iseMenuOpen: false,
};

NavigationMenu.propTypes = {
  iseMenuOpen: PropTypes.bool,
};

export default NavigationMenu;
