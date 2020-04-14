import GraphileUtils from 'graphile-utils';

import { byTableNameAndId, allowOnly } from '../../utils/graphile.util';
import { createContact, sendWelcome } from '../../utils/sendinblue.util';
import { passwordMaker, compareHash } from '../../utils/hash.util';
import * as Storage from '../../utils/storage.util';
import { Slack } from '../../utils/slack.util';

const {
  gql,
  makeExtendSchemaPlugin,
  makePluginByCombiningPlugins,
  makeWrapResolversPlugin
} = GraphileUtils;

const plugin = makeWrapResolversPlugin({
  User: {
    purchases: allowOnly(['admin'], []),
    purchasesList: allowOnly(['admin'], []),
    async password () {
      return '';
    }
  },
  Mutation: {
    createUser: {
      requires: {
        childColumns: [
          { column: 'id', alias: '$id' },
          { column: 'first_name', alias: '$firstName' },
          { column: 'last_name', alias: '$lastName' },
          { column: 'email', alias: '$email' }
        ]
      },
      async resolve (resolve, source, args, ctx) {
        const propName = 'user';
        if (args.input[propName].password) {
          args.input[propName].password = await passwordMaker(
            args.input[propName].password
          );
        }
        const resolved = await resolve();
        const data = resolved.data;
        if (data.$email) {
          await createContact({
            userId: data.$id,
            firstName: data.$firstName,
            lastName: data.$lastName,
            email: data.$email
          });
          const { locale } = ctx.req;
          await sendWelcome(data.$email, locale);
        }

        Slack.newUser({
          id: data.$id,
          email: data.$email,
          firstName: data.$firstName,
          lastName: data.$lastName
        });

        return resolved;
      }
    }
  }
});

const schema = makeExtendSchemaPlugin(build => {
  return {
    typeDefs: gql`
      input PasswordPatch {
        old: String!
        new: String!
      }

      input CurrentUserPatch {
        firstName: String
        lastName: String
        email: String
        password: PasswordPatch
        avatar: Upload
      }

      type UpdateCurrentUserPayload {
        currentUser: User! @pgField
        query: Query
      }

      type LoginPayload {
        """
        0 - success

        1 - invalid credentials

        2 - try facebook
        """
        errorCode: Int!
        """
        Message about why login failed, null on success.
        """
        message: String
      }

      input UpdateUserStatusInput {
        userId: Int!
        """
        0 active, 1 blocked
        """
        status: Int!
      }

      extend type Mutation {
        login(email: String!, password: String!): LoginPayload!
        logout: Boolean
        updateCurrentUser(input: CurrentUserPatch!): UpdateCurrentUserPayload
      }
    `,
    resolvers: {
      Mutation: {
        async login (query, args, ctx) {
          const { email, password } = args;

          const { user, info } = await ctx.authenticate('graphql-local', {
            username: email,
            password: password
          });

          if (user) {
            await ctx.login(user);
            return { message: null, errorCode: 0 };
          }

          // this will return message from info
          return info;
        },

        async logout (query, args, ctx) {
          if (ctx.isAuthenticated()) {
            await ctx.logout();
            return true;
          } else {
            return false;
          }
        },

        async updateCurrentUser (source, args, ctx, info) {
          const { pgClient } = ctx;
          const user = ctx.getUser();
          const patch = args.input;

          if (patch.password) {
            if (!(await compareHash(patch.password.old, user.password))) {
              throw Error('invalid current password');
            }
            patch.password.new = await passwordMaker(patch.password.new);
          }

          const fragments = [];

          if (patch.firstName) {
            fragments.push(`first_name='${patch.firstName}'`);
          }
          if (patch.lastName) fragments.push(`last_name='${patch.lastName}'`);
          if (patch.email) fragments.push(`email='${patch.email}'`);
          if (patch.password && patch.password.new) {
            fragments.push(`password='${patch.password.new}'`);
          }
          if (patch.avatar) {
            const upload = await patch.avatar;
            const url = await Storage.uploadAvatar(upload, args, ctx);
            fragments.push(`avatar='${url}'`);
          }

          const query = `update app_public.users set ${fragments.join(
            ', '
          )} where id=${user.id}`;

          await pgClient.query(query);

          return {
            data: await byTableNameAndId(user.id, 'users', info)
          };
        }
      }
    }
  };
});

export default makePluginByCombiningPlugins(schema, plugin);
