import gql from 'graphql-tag';

import { instrumentAll } from '_graphql/fragments/instruments';

export const FETCH_INSTRUMENTS = gql`
  query FetchInstruments {
    instrumentsList {
        ...instrumentAll
      }
    }

  ${instrumentAll}
`;
