import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentLang } from 'locales/helpers';

const locale = getCurrentLang();

const LocalizedLink = ({ to, ...props }) => {
  const path = `/${locale}${to}`;
  return <Link to={path} {...props} />;
};

export default LocalizedLink;
