export default function LocalePlugin (builder) {
  builder.hook('GraphQLObjectType:fields:field', (field, build, ctx) => {
    const { pgSql: sql, inflection, options } = build

    const {
      scope: { pgFieldIntrospection },
      addDataGenerator
    } = ctx

    if (
      !pgFieldIntrospection ||
      !pgFieldIntrospection.tags ||
      !Object.keys(pgFieldIntrospection.tags).length ||
      !pgFieldIntrospection.tags.localize
    ) {
      return field
    }

    const tableName =
    inflection.singularize(pgFieldIntrospection.class.name) + '_locales'
    const columnName = pgFieldIntrospection.name

    addDataGenerator(({ alias }) => {
      return {
        pgQuery (queryBuilder) {
          const sub = Symbol('query')
          const locale = queryBuilder.context.req.locale

          queryBuilder.select(
            () => sql.fragment`(
              select
                ${sql.identifier(sub, columnName)} 
              from ${sql.identifier(options.localesSchema, tableName)}
              as ${sql.identifier(sub)}
              where ${sql.identifier(sub, 'lang')} = ${sql.value(locale)}
              and ${sql.identifier(
                sub,
                'source_id'
              )} = ${queryBuilder.getTableAlias()}.id
            )`,
            alias + `_${locale}`
          )
        }
      }
    })

    return Object.assign(field, {
      async resolve (source, args, context, info) {
        const locale = context.req.locale
        const key = `${info.fieldName}_${locale}`
        return source[key]
      }
    })
  })
}
