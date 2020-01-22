import { gql } from 'apollo-boost';

export const FETCH_DOCUMENT = gql`
  query FetchDocument($name: String!) {
    documents: documentsList(filter: { name: { equalTo: $name } }) {
      id
      name
      content
    }
  }
`;
