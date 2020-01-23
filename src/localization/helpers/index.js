import React from 'react';
import { useIntl } from 'react-intl';

// Designed for refactor. to not crash an app.
export const withI18n = (Comp) => (props) => {
  const intl = useIntl();

  const i18n = (key) => (intl.messages && intl.messages[key]) || ' ';

  return (
    <Comp {...props} i18n={i18n}/>
  );
};

export const divideTextToParagraphs = (text = '', symbol = '#$') => <>{text.split(symbol).map((txt, index) => <p
  key={index}>{txt}</p>)}</>;
