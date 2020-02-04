import { gql } from 'apollo-boost';

export const REQUEST_MESSAGE = gql`
  mutation RequestMessage(
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
      # only admin can read open messages
      # so you can select openMessage immediately, but not later
      openMessage {
        id
        message
      }
    }
  }
`;
