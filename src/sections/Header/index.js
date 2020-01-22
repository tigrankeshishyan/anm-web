import React from 'react';
import clsx from 'clsx';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';

import LanguageSwitcher from 'localization/LanguageSwitcher';
import { withI18n } from 'localization/helpers';

import { LogoOriginalSVG } from 'static/images';
import { isWindowExists } from 'helpers';

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
    document.addEventListener('scroll', this.handleScrollChange);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScrollChange);
  }

  handleScrollChange = () => {

    if (isWindowExists()) {
      const isScrolled = window.scrollY > 0;

      if (this.state.isScrolled !== isScrolled) {
        window.requestAnimationFrame(() => {
          this.setState({
            isScrolled,
          });
        });
      }
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

    const {
      // Location provided by Layout component
      location,
      pageContext,
    } = this.props;

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
                <LogoOriginalSVG/>
              </Link>
            </div>

            <NavigationMenu
              location={location}
              iseMenuOpen={isHeaderOpen}
              setMenuOpenStatus={this.setMenuOpenStatus}
            />
            <LanguageSwitcher
              pageContext={pageContext}
            />

            <Auth />
          </div>
        </header>
      </ClickAwayListener>
    );
  }
}

Header.defaultProps = {
  pageContext: {},
};

export default withI18n(Header);
