import { database } from '../config'

export async function byTableNameAndId (
  id,
  tableName,
  resolveInfo,
  idColumnName = 'id'
) {
  const sql = resolveInfo.graphile.build.pgSql
  const rows = await resolveInfo.graphile.selectGraphQLResultFromTable(
    sql.fragment`${sql.identifier(database.schema, tableName)}`,
    (tableAlias, queryBuilder) => {
      queryBuilder.where(
        sql.fragment`${sql.identifier(idColumnName)} = ${sql.value(id)}`
      )
      queryBuilder.limit(1)
    }
  )

  return rows[0]
}

export function objCamelCase (obj, camelCase) {
  return (
    obj &&
    Object.keys(obj).reduce(function (newObj, key) {
      newObj[camelCase(key)] = obj[key]
      return newObj
    }, {})
  )
}

/**
 * @param {Array<string>} roles
 * @param {any} returnValue If error resolver will throw.
 */
export function allowOnly (roles, returnValue) {
  return (resolve, parent, args, ctx, info) => {
    const user = ctx.getUser()

    if (user && roles.includes(user.role)) {
      return resolve()
    }

    if (info.path.prev.key === 'currentUser') {
      return resolve()
    }

    if (returnValue.stack && returnValue.message) {
      throw returnValue
    }

    return returnValue || null
  }
}
