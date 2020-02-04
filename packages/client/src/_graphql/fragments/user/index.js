import { gql } from 'apollo-boost';
import { scoreMain } from '_graphql/fragments/scores';

export const userAll = gql`
  fragment userAll on User {
    id
    nodeId
    firstName
    lastName
    email
    createdAt
    updatedAt
    role
    purchases: purchasesList(filter: { status: { equalTo: PAID } }) {
      score {
        ...scoreMain
      }
    }
  }
  ${scoreMain}
`;
