import gql from 'graphql-tag';
import { scoreMain } from '_graphql/fragments/scores';

export const FETCH_SCORES = gql`
  query FetchScores(
    $count: Int,
    $offset: Int
    $filter: ScoreFilter
  ) {
    scores(
      filter: $filter
      first: $count
      offset: $offset
      orderBy: PUBLISHED_AT_DESC
    ) {
      nodes {
        ...scoreMain
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }

  ${scoreMain}
`;

export const FETCH_SCORE_PURCHASE_LINK = gql`
  query FetchScorePurchaseLink(
    $scoreId: Int!,
    $redirect: String!,
    $country: String!,
    $currency: String!,
  ) {
    scorePurchaseLink(input: {
      scoreId: $scoreId
      redirect: $redirect
      country: $country
      currency: $currency
    })
  }
`;

export const FETCH_SINGLE_SCORE = gql`
  query FetchScore($id: Int!) {
    score(id: $id) {
      ...scoreMain
    }
  }

  ${scoreMain}
`;
