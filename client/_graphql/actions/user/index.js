import { gql } from 'apollo-boost';
import { userAll } from '_graphql/fragments';

export const AUTHENTICATE_USER = gql`
  query AuthenticateUser {
    currentUser {
      ...userAll
    }
  }
  ${userAll}
`;

export const LOG_IN = gql`
  mutation Login ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      message
      errorCode
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser (
    $email: String!,
    $password: String!,
    $firstName: String!,
    $lastName: String!
  ) {
    createUser(input: {
      user: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    }) {
      user {
        ...userAll
      }
    }
  }
  ${userAll}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser ($email: String!, $firstName: String!, $lastName: String!) {
    updateCurrentUser(input: {
      email: $email
      lastName: $lastName
      firstName: $firstName
    }) {
      currentUser {
        ...userAll
      }
    }
  }

  ${userAll}
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const FORGET_PASSWORD = gql`
  mutation ForgetPassword($email: String!) {
    forgetPassword(
      input: {
        email: $email
      }
    ) {
      success
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(input: {
      token: $token
      newPassword: $newPassword
    }) {
      success
    }
  }
`;
