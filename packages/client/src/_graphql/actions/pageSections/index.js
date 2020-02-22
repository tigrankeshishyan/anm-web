import gql from 'graphql-tag';
import { pageSectionsAll } from '_graphql/fragments';

export const FETCH_SINGLE_PAGE_SECTION = gql`
  query FetchSinglePageSection($name: String!, $page: String!) {
    pageSection(name: $name, page: $page) {
      ...pageSectionsAll
    }
  }

  ${pageSectionsAll}
`;
