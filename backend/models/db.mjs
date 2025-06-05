import '../config.mjs';  // this loads env vars first
import pkg from 'pg';
const { Pool } = pkg;

const useSSL = process.env.DATABASE_URL?.includes('render.com');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});



export default pool;
