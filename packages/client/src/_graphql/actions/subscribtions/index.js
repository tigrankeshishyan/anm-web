import gql from 'graphql-tag';

export const CREATE_SUBSCRIPTION_CONTACT = gql`
  mutation CreateSubscriptionContact($email: String!) {
    addContact (input: { email: $email })
  }
`;
