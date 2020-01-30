import React from 'react';
import SocialIcon from 'components/SocialIcon';
import { isWindowExists } from 'helpers';
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
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
  const url = isWindowExists()
    ? window.location.href
    : process.env.REACT_APP_HOST;

  return (
    <div className="flex-row wrap align-center">
      {icons.map((icon, index) => (
        <icon.buttonContainer
          url={url}
          key={index}
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

SocialShareIcons.defaultProps = {};

SocialShareIcons.propTypes = {};

export default SocialShareIcons;
