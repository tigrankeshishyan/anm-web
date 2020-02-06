import { gql } from 'apollo-boost';

import { tagAll } from '_graphql/fragments';

export const FETCH_TAGS = gql`
  query FetchTags { 
    tags: tagsList {
      ...tagAll
    }
  }
  
  ${tagAll}
`;
