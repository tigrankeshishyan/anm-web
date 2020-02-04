import GraphileUtils from 'graphile-utils'

const { makeWrapResolversPlugin } = GraphileUtils

class AuthError extends Error {}

const publicMutations = [
  'login',
  'logout',
  'addContact',
  'createUser',
  'createContactMessage',
  'updateCurrentUser',
  'purchaseScore',
  'forgetPassword',
  'resetPassword'
]

export default makeWrapResolversPlugin(
  ({ scope }, build, field, options) => {
    return {
      scope,
      isPublic:
        publicMutations.some(name => name === scope.fieldName) ||
        !scope.isRootMutation
    }
  },
  ({ scope, isPublic }) => async (resolver, source, args, context) => {
    const user = context.getUser()
    const role = user && user.role

    if (isPublic) {
      return resolver()
    }

    if (role === 'admin') {
      return resolver()
    }

    if (role === 'editor' && !scope.fieldName.includes('User')) {
      return resolver()
    }

    throw new AuthError('you are not allowed to modify this data')
  }
)
