import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withI18n } from 'localization/helpers';

import {
  FacebookIcon,
  TelegramIcon,
  WhatsappIcon,
  TwitterIcon,
  VKIcon,
  OKIcon,
  FacebookShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  VKShareButton,
  OKShareButton,
} from 'react-share';

import './styles.sass';

const icons = [
  {
    buttonContainer: FacebookShareButton,
    icon: FacebookIcon,
  },
  {
    buttonContainer: TwitterShareButton,
    icon: TelegramIcon,
  },
  {
    buttonContainer: TelegramShareButton,
    icon: WhatsappIcon,
  },
  {
    buttonContainer: WhatsappShareButton,
    icon: TwitterIcon,
  },
  {
    buttonContainer: VKShareButton,
    icon: VKIcon,
  },
  {
    buttonContainer: OKShareButton,
    icon: OKIcon,
  },
];

function ShareOnSocial(props) {
  const { i18n } = props;
  
  return (
    <div className="mrg-top-15 pad-sides-10">
      <Divider />
      <Typography
        color="primary"
        className="share-on-social-text"
      >
        {i18n('shareOnSocial')}
      </Typography>
    
      <div className="mrg-top-15">
        <div className="flex-row wrap align-center">
          {icons.map((icon, index) => (
            <icon.buttonContainer
              key={index}
              url={window.location.href}
              className="social-share-icon"
            >
              <icon.icon
                round
                size={26}
              />
            </icon.buttonContainer>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withI18n(ShareOnSocial);
