import gql from 'graphql-tag';

export const FETCH_DOCUMENT = gql`
  query FetchDocument($name: String!) {
    documents: documentsList(filter: { name: { equalTo: $name } }) {
      id
      name
      content
    }
  }
`;
