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
              SELECT
                ${sql.identifier(sub, columnName)} 
              FROM ${sql.identifier(options.localesSchema, tableName)}
              AS ${sql.identifier(sub)}
              WHERE ${sql.identifier(sub, 'lang')} = ${sql.value(locale)}
              AND ${sql.identifier(
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
