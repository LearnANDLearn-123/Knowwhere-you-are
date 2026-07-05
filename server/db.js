import pg from 'pg'

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'meridian_db',
  user: 'meridian_user',
  password: 'meridian_pass',
})

export default pool
