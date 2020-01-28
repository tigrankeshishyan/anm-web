import { gql } from 'apollo-boost';

export const REQUEST_MESSAGE = gql`
  mutation ReaquestMessage(
    $name: String
    $email: String!
    $message: String!
    $file: Upload
  ) {
    createContactMessage(input: {
      contactMessage: {
        name: $name
        email: $email
        message: $message
        attachedFile: $file
      }
    }){
      contactMessage {
        id
        email
      }
    }
  }
`;
