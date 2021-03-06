import React from 'react';
import clsx from 'clsx';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import LanguageSwitcher from 'localization/LanguageSwitcher';
import { withI18n } from 'localization/helpers';

import { ReactComponent as LogoOriginal } from 'images/ANM-logo-small-original.svg';

import Link from 'components/Link';

import Auth from 'Auth';

import NavigationMenu from './NavigationMenu';

import './styles.sass';

class Header extends React.PureComponent {
  state = {
    isScrolled: false,
    isHeaderOpen: false,
  };
  
  componentDidMount() {
    document.addEventListener('scroll', this.handleScrollChange, { passive: true });
  }
  
  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollChange);
  }
  
  handleScrollChange = () => {
    const isScrolled = window.scrollY > 0;
    
    if (this.state.isScrolled !== isScrolled) {
      window.requestAnimationFrame(() => {
        this.setState({
          isScrolled,
        });
      });
    }
  };
  
  setMenuOpenStatus = status => {
    this.setState({
      isHeaderOpen: status,
    });
  };
  
  render() {
    const {
      isScrolled,
      isHeaderOpen,
    } = this.state;
    
    return (
      <ClickAwayListener
        touchEvent={isHeaderOpen ? 'onTouchEnd' : false}
        mouseEvent={isHeaderOpen ? 'onMouseUp' : false}
        onClickAway={() => this.setMenuOpenStatus(false)}
      >
        <header
          id="anm-app-header"
          className={clsx({
            scrolled: isScrolled,
            'open-header': isHeaderOpen,
          })}
        >
          <div className="app-bar">
            <div className="logo-wrapper">
              <Link
                to="/home"
                className="app-logo"
                onClick={() => this.setMenuOpenStatus(false)}
              >
                <LogoOriginal />
              </Link>
            </div>
            
            <NavigationMenu
              iseMenuOpen={isHeaderOpen}
              setMenuOpenStatus={this.setMenuOpenStatus}
            />
            
            <LanguageSwitcher/>
            
            <Auth/>
          </div>
        </header>
      </ClickAwayListener>
    );
  }
}

export default withI18n(Header);
