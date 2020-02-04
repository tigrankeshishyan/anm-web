import { gql } from 'apollo-boost';

export const REQUEST_MESSAGE = gql`
  mutation ReaquestMessage(
    $name: String
    $email: String!
    $message: String!
    $file: Upload
  ) {
    createOpenMessage(input: {
      openMessage: {
        name: $name
        email: $email
        message: $message
        attachedFile: $file
      }
    }){
      openMessage {
        id
        email
      }
    }
  }
`;
