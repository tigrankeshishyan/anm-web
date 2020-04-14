const tablesWithHistory = ['articles', 'musicians', 'scores'];

export default function AutoUpdatePlugin (builder) {
  builder.hook('GraphQLObjectType:fields:field', (field, build, context) => {
    const {
      scope: { isPgCreateMutationField, isPgUpdateMutationField, pgFieldIntrospection: table }
    } = context;
    const isCreatOrUpdate = isPgCreateMutationField || isPgUpdateMutationField;
    if (!isCreatOrUpdate || table.kind !== 'class' || !tablesWithHistory.includes(table.name)) {
      return field;
    }

    const oldResolve = field.resolve;

    return {
      ...field,
      resolve (_mutation, args, context, info) {
        const user = context.getUser();

        if (isPgCreateMutationField) {
          for (const key of Object.keys(args.input)) {
            if (typeof args.input[key] === 'object') {
              args.input[key].authorId = user.id;
              if (args.input[key].published) {
                args.input[key].publishedAt = (new Date()).toISOString();
              }
            }
          }
        }

        if (isPgUpdateMutationField) {
          for (const key of Object.keys(args.input)) {
            if (typeof args.input[key] === 'object') {
              args.input[key].updaterId = user.id;

              // allow admins to set 'publishedAt'
              if (user.role === 'admin' && args.input[key].publishedAt) {
                continue;
              } else if (args.input[key].published) {
                args.input[key].publishedAt = (new Date()).toISOString();
              } else if (args.input[key].published === false) {
                args.input[key].publishedAt = null;
              }
            }
          }
        }

        return oldResolve(_mutation, args, context, info);
      }
    };
  });
}
