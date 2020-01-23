import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import { ApolloProvider } from '@apollo/react-hooks';
import ToastMessages from 'containers/ToastMessages';

import MaterialThemeProvider from 'theme/MaterialThemeProvider';

import CookieBanner from 'components/CookieBanner';

import Header from 'sections/Header';
import Footer from 'sections/Footer';

import IntlProvider from 'localization';

import client from '_graphql';

import routes from 'routes';

import './index.sass';

function Layout(props) {
  return (
    <BrowserRouter>
      <IntlProvider {...props}>
        <ApolloProvider client={client}>
          <MaterialThemeProvider>
            <ToastMessages>
              <div className="flex-column anm-app-layout">
                <div className="grow">
                  <Header
                    location={props.location}
                  />
                  <Switch>
                    <main className="main-app">
                      {renderRoutes(routes)}
                    </main>
                  </Switch>
                </div>
                <Footer/>
                <CookieBanner/>
              </div>
            </ToastMessages>
          </MaterialThemeProvider>
        </ApolloProvider>
      </IntlProvider>
    </BrowserRouter>
  );
}

export default Layout;
