import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigration(file) {
  const sql = await fs.readFile(file, 'utf8');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log(`Executed ${path.basename(file)}`);
  } catch (err) {
    console.error(`Failed to run ${path.basename(file)}:`, err);
  } finally {
    client.release();
  }
}

async function migrate() {
  const dir = path.resolve('./db');
  const files = await fs.readdir(dir);
  files.sort();
  for (const file of files) {
    if (file.endsWith('.sql')) {
      await runMigration(path.join(dir, file));
    }
  }
  await pool.end();
}

migrate().catch(console.error);
