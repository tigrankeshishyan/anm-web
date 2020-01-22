import Grid from '@material-ui/core/Grid';
import React from 'react';

import { ApolloProvider } from '@apollo/react-hooks';
import ToastMessages from 'containers/ToastMessages';

import MaterialThemeProvider from 'theme/MaterialThemeProvider';

import CookieBanner from 'components/CookieBanner';

import MainApp from 'sections/MainApp';
import Header from 'sections/Header';
import Footer from 'sections/Footer';

import IntlProvider from 'localization';

import client from '../../gatsby-theme-apollo/client';

import './index.sass';

function Layout(props) {
  const {
    children,
  } = props;

  return (
    <IntlProvider {...props}>
      <ApolloProvider client={client}>
        <MaterialThemeProvider>
          <ToastMessages>
            <div className="flex-column anm-app-layout">
              <div className="grow">
                <Header
                  location={props.location}
                  pageContext={props.pageContext}
                />
                <MainApp>
                  {children}
                </MainApp>
              </div>
              <Footer />
              <CookieBanner />
            </div>
          </ToastMessages>
        </MaterialThemeProvider>
      </ApolloProvider>
    </IntlProvider>
  );
}

export default Layout;
