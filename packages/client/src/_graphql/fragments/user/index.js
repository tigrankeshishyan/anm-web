import gql from 'graphql-tag';
import { scoreMain } from '_graphql/fragments/scores';

export const userAll = gql`
  fragment userAll on User {
    id
    role
    email
    nodeId
    lastName
    firstName
    updatedAt
    facebookId
    emailVerificationStatus
    purchases: purchasesList(filter: { status: { equalTo: PAID } }) {
      score {
        ...scoreMain
      }
    }
  }
  ${scoreMain}
`;
