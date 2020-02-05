import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import { ApolloProvider } from '@apollo/react-hooks';
import ToastMessages from 'containers/ToastMessages';

import CookieBanner from 'components/CookieBanner';

import RouteProvider from 'containers/RouteProvider';

import Header from 'sections/Header';
import Footer from 'sections/Footer';

import IntlProvider from 'localization';

import client from '_graphql';

import routes from 'routes';

import 'styles/common.sass';

import './index.sass';

function Layout(props) {
  return (
    <BrowserRouter>
      <RouteProvider>
        <IntlProvider {...props}>
          <ApolloProvider client={client}>
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
          </ApolloProvider>
        </IntlProvider>
      </RouteProvider>
    </BrowserRouter>
  );
}

export default Layout;
