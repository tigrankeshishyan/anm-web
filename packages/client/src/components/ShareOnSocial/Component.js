import React from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { withI18n } from 'localization/helpers';

import SocialIcon from 'components/SocialIcon';
import {
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
    icon: () => <SocialIcon iconName="Facebook" />,
  },
  {
    buttonContainer: TwitterShareButton,
    icon: () => <SocialIcon iconName="Twitter" />,
  },
  {
    buttonContainer: TelegramShareButton,
    icon: () => <SocialIcon iconName="Telegram" />,
  },
  {
    buttonContainer: WhatsappShareButton,
    icon: () => <SocialIcon iconName="WhatsApp" />,
  },
  {
    buttonContainer: VKShareButton,
    icon: () => <SocialIcon iconName="Vk" />,
  },
  {
    buttonContainer: OKShareButton,
    icon: () => <SocialIcon iconName="Ok" />,
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
