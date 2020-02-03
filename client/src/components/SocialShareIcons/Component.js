import React from 'react';
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

function SocialShareIcons() {
  return (
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
  );
}

export default SocialShareIcons;
