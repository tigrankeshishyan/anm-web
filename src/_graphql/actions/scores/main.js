import { gql } from 'apollo-boost';
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

export const CHECK_IF_SCORE_PURCHASED = gql`
  query CheckIfscorePurchased($scoreId: Int!) {
    isScorePurchased(scoreId: $scoreId)
  }
`;

export const SEARCH_SCORE = gql`
  query SearchScore($title: String) {
    scores(filter: {
      scoreLocalesBySourceId: {
        some: { title: { includesInsensitive: $title } }
      }}) {
      nodes {
        ...scoreMain,
      }
    }
  }
  
  ${scoreMain}
`;
