import pool from '../models/db.mjs';

// Get all jobs for authenticated user
export async function getJobs(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get jobs' });
  }
}

export async function createJob(req, res) {
  const userId = req.user.id;
  const { title, company, location, url, description, status, applied_date, deadline } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO jobs (user_id, title, company, location, url, description, status, applied_date, deadline, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING *`,
      [userId, title, company, location, url, description, status, applied_date, deadline]
    );
    res.status(201).json({ job: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
}

export async function updateJob(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, company, location, url, description, status, applied_date, deadline } = req.body;

  try {
    const result = await pool.query(
      `UPDATE jobs SET title=$1, company=$2, location=$3, url=$4, description=$5, status=$6, applied_date=$7, deadline=$8, updated_at=NOW()
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [title, company, location, url, description, status, applied_date, deadline, id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Job not found or unauthorized' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
}

export async function deleteJob(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
}
