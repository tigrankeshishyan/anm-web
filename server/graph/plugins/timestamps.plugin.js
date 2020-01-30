export default function TimestampsPlugin (builder) {
  builder.hook('GraphQLObjectType:fields:field', (field, build, context) => {
    const {
      scope: { isPgCreateMutationField, isPgUpdateMutationField, pgFieldIntrospection: table }
    } = context
    const isCreatOrUpdate = isPgCreateMutationField || isPgUpdateMutationField
    if (!isCreatOrUpdate || table.kind !== 'class') {
      return field
    }

    const oldResolve = field.resolve

    return {
      ...field,
      resolve (source, args, context, info) {
        if (isPgCreateMutationField) {
          for (const key of Object.keys(args.input)) {
            if (typeof args.input[key] === 'object') {
              const date = new Date().toISOString()
              args.input[key].createdAt = date
              args.input[key].updatedAt = date
            }
          }
        }
        if (isPgUpdateMutationField) {
          for (const key of Object.keys(args.input)) {
            if (typeof args.input[key] === 'object') {
              args.input[key].updatedAt = new Date().toISOString()
            }
          }
        }
        return oldResolve(source, args, context, info)
      }
    }
  })
}
