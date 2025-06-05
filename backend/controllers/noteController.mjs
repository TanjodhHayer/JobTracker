import pool from '../models/db.mjs';

// Get all notes for a job owned by the user
export async function getNotes(req, res) {
  const userId = req.user?.id;
  const { jobId } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `SELECT notes.* FROM notes
       JOIN jobs ON notes.job_id = jobs.id
       WHERE notes.job_id = $1 AND jobs.user_id = $2
       ORDER BY notes.created_at DESC`,
      [jobId, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get notes' });
  }
}

export async function createNote(req, res) {
  const userId = req.user?.id;
  const { job_id, content } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Confirm the job belongs to this user before inserting note
    const jobCheck = await pool.query(
      'SELECT 1 FROM jobs WHERE id = $1 AND user_id = $2',
      [job_id, userId]
    );
    if (jobCheck.rowCount === 0) {
      return res.status(403).json({ error: 'Not authorized to add note to this job' });
    }

    const result = await pool.query(
      'INSERT INTO notes (job_id, content, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING *',
      [job_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create note' });
  }
}

export async function updateNote(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { content } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Update only if the note belongs to a job owned by the user
    const result = await pool.query(
      `UPDATE notes SET content=$1, updated_at=NOW()
       WHERE id=$2 AND job_id IN (SELECT id FROM jobs WHERE user_id = $3)
       RETURNING *`,
      [content, id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update note' });
  }
}

export async function deleteNote(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `DELETE FROM notes
       WHERE id = $1 AND job_id IN (SELECT id FROM jobs WHERE user_id = $2)`,
      [id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Note not found or unauthorized' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
}
