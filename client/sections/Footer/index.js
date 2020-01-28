import React from 'react';
import Typography from '@material-ui/core/Typography';

import { withI18n } from 'localization/helpers';
import { LogoWhiteSVG } from 'images';

import SocialIcons from 'components/SocialIcons';
import Link from 'components/Link';

import SubscriptionForm from './SubscriptionForm';

import './styles.sass';

function Footer(props) {
  const {
    i18n,
  } = props;

  return (
    <footer
      id="anm-app-footer"
      className="anm-footer"
    >
      <div className="flex-row align-center wrap footer-logo-and-terms-wrapper">
        <div className="mobile-social-icons-wrapper justify-center">
          {/*<SocialIcons />*/}
        </div>

        <Link to="/home">
          <LogoWhiteSVG
            className="anm-footer-logo"
          />
        </Link>

        <div className="flex-column footer-links-wrapper">
          <Link
            to="/about-us"
            noDecoration={false}
            className="text-color-white pad-10"
          >
            {i18n('aboutUs')}
          </Link>
          <Link
            to="/terms"
            noDecoration={false}
            className="text-color-white pad-10"
          >
            {i18n('termsAndPrivacyPolicy')}
          </Link>
        </div>
      </div>

      <div className="flex-row bottom-section-wrapper">
        <div className="flex-column justify-end copyright-wrapper">
          <Typography className="copyright-text">
            Ⓒ
            {' '}
            {i18n('footer.copyright')}
            <br />
            2013 -
            {' '}
            {new Date().getFullYear()}
          </Typography>
        </div>

        <div className="flex-column justify-end subscribe-wrapper">
          <div className="desktop-social-icons-wrapper pad-15">
            <SocialIcons className="justify-end" />
          </div>

          <SubscriptionForm />
        </div>
      </div>
    </footer>
  );
}

export default withI18n(Footer);
