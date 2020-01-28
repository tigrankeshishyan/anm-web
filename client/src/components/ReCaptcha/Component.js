import React, { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { googleRecaptchaKeyV2 } from '_constants';
import { getCurrentLang } from 'locales/helpers';

import './styles.sass';

function ReCaptcha(props, ref) {
  return (
    <ReCAPTCHA
      {...props}
      ref={ref}
      hl={getCurrentLang()}
      sitekey={googleRecaptchaKeyV2}
    />
  );
}

export default forwardRef(ReCaptcha);
