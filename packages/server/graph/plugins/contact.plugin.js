import GraphileUtils from 'graphile-utils';

import { createContact, unsubscribeContact } from '../../utils/sendinblue.util';

const {
  gql,
  makePluginByCombiningPlugins,
  makeExtendSchemaPlugin
} = GraphileUtils;

const schema = makeExtendSchemaPlugin(() => {
  return {
    typeDefs: gql`
      input ContactInput {
        email: String!
        firstName: String
        lastName: String
      }

      extend type Mutation {
        addContact (input: ContactInput!): Boolean!

        """
        "true" on success and "false" if user email not found
        or user is not authenticated
        """
        unsubscribe: Boolean!
      }
    `,
    resolvers: {
      Mutation: {
        async addContact (_query, { input }, ctx) {
          const user = ctx.getUser();
          await createContact({ ...input, userId: user && user.id });

          return true;
        },
        async unsubscribe (root, args, ctx) {
          const user = ctx.getUser();

          if (user && user.email) {
            await unsubscribeContact(user.email);
          } else {
            return false;
          }

          return true;
        }
      }
    }
  };
});

export default makePluginByCombiningPlugins(schema);
