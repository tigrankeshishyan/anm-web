import { database } from '../../config'
import { Purchase } from '../_sequelize/models/purchase.model'

/**
 * @param {Object} pgClient
 * @param {number} id
 * @param {string} table
 * @param {{table, lang}} [locale]
 */
export async function selectById (pgClient, id, table, locale) {
  const query = locale
    ? `SELECT a.*, l.* FROM ${database.schema}.${table} AS a
    LEFT OUTER JOIN ${database.schema}.${locale.table} AS l
        ON a.id=l.source_id AND l.lang='${locale.lang}'
  WHERE id=$1`
    : `SELECT * FROM ${database.schema}.${table} WHERE id=$1`

  const {
    rows: [row]
  } = await pgClient.query(query, [id])

  return row
}

/**
 * @param {Object} pgClient
 * @param {{table, column, value}} params
 */
export async function deleteFrom (pgClient, params) {
  const { table, column = 'id', value } = params
  const query = `DELETE FROM ${database.schema}.${table} WHERE ${column}=$1`

  const {
    rows: [row]
  } = await pgClient.query(query, [value])

  return row
}

/**
 * @param {Object} pgClient
 * @param {string} table
 * @param {Object} data The column value pair that must be inserted.
 * @param {boolean} returning
 */
export async function insertInto (pgClient, table, data, returning = true) {
  const entries = Object.entries(data)
  const columns = entries.map(([key]) => key).join(', ')
  const values = entries.map((_, index) => `$${index + 1}`).join(', ')

  const _returning = returning ? 'RETURNING *' : ''
  const query = `INSERT INTO ${database.schema}.${table}(${columns}) 
  VALUES(${values}) ${_returning}`

  const {
    rows: [row]
  } = await pgClient.query(query, Object.values(data))

  return row
}

/**
 * @param {Object} pgClient
 * @param {string} table
 * @param {number} id
 * @param {Object} data
 */
export async function update (pgClient, table, id, data) {
  const entries = Object.entries(data)
  const updateData = entries
    .map(([key], index) => `${key}=$${index + 1}`)
    .join(', ')

  const query = `UPDATE ${database.schema}.${table} SET ${updateData} WHERE id=${id}`

  await pgClient.query(query, Object.values(data))
}

/**
 * @param {Object} pgClient
 * @param {number} userId
 * @param {number} scoreId
 */
export async function userPurchasedScore (pgClient, userId, scoreId) {
  const query = `SELECT id FROM ${database.schema}.purchases 
    WHERE user_id=$1 AND score_id=$2 AND status=$3`

  const {
    rows: [row]
  } = await pgClient.query(query, [userId, scoreId, Purchase.PAID])

  return row
}

export async function getPromoByCode (pgClient, code) {
  const {
    rows: [promo]
  } = await pgClient.query(
    `SELECT * FROM ${database.schema}.promo_codes WHERE code=$1`,
    [code]
  )

  return promo
}

/**
 * @param {number} rowCount
 * @param {number} colCount
 *
 * @description Generate values string for pgClient.
 * Example.
 * paramKeys(4, 4)
 * ($1, $2, $3, $4),
 * ($5, $6, $7, $8)
 */
export function paramKeys (rowCount, colCount) {
  const nextLine = (_, index) => {
    const params =
      new Array(colCount)
        .fill(index * colCount)
        .map((rowIndex, colIndex) => `$${rowIndex + colIndex + 1}`)
        .join(', ') + ''

    return `(${params})`
  }

  return new Array(rowCount)
    .fill(null)
    .map(nextLine)
    .join(',\n')
}
