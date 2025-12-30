const { query } = require("../db/db.js");

async function getUserByID(id) {
  const sql = `
    SELECT * 
    FROM users
    WHERE id = $1
    LIMIT 1
    `;

  const { rows } = await query(sql, [id]);

  return rows[0] || null;
}

async function createUserIfNotExists(username, id) {
  const sql = `
    INSERT INTO users(id, username)
    VALUES ($1, $2)
    ON CONFLICT (id)
    DO NOTHING
    RETURNING *
    `;

  const { rows } = await query(sql, [id, username]);

  if (rows.length === 0) {
    return getUserByID(id);
  }

  return rows[0];
}

async function insertIntoList(
  user_id,
  item_type,
  tmdb_id,
  title,
  year,
  list_type
) {
  const sql = `
    INSERT INTO user_lists(user_id, list_type, tmdb_id, item_type, title, release_year)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id, list_type, tmdb_id, item_type)
    DO NOTHING
    RETURNING *
    `;

  const { rows } = await query(sql, [
    user_id,
    list_type,
    tmdb_id,
    item_type,
    title,
    year,
  ]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

async function deleteListItem(user_id, list_type, item_type, tmdb_id) {
  const sql = `
    DELETE FROM user_lists
    WHERE user_id = $1
    AND list_type = $2
    AND item_type = $3
    AND tmdb_id = $4
    RETURNING *
    `;

  const { rows } = await query(sql, [user_id, list_type, item_type, tmdb_id]);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}
