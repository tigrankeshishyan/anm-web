import { gql } from 'apollo-boost';

export const CREATE_SUBSCRIPTION_CONTACT = gql`
  mutation CreateSubscriptionContact($email: String!) {
    addContact (input: { email: $email })
  }
`;
