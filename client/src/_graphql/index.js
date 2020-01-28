import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-boost';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { getCurrentLang } from 'locales/helpers';
import fetch from 'isomorphic-fetch';

export default new ApolloClient({
  fetch,
  connectToDevTools: true,
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
      if (networkError) console.error(`[Network error]: ${networkError}`);
    }),
    createUploadLink({
      uri: `${process.env.REACT_APP_HOST}/graphql`,
      credentials: 'include',
      headers: {
        Authorization: null,
        'Accept-Language': getCurrentLang() === 'en' ? 'en-US' : getCurrentLang(),
      },
    }),
  ]),
  cache: new InMemoryCache(),
});
