import pool from '../models/db.mjs';

export async function getReminders(req, res) {
  const userId = req.user?.id;
  const { jobId } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `SELECT reminders.* FROM reminders
       JOIN jobs ON reminders.job_id = jobs.id
       WHERE reminders.job_id = $1 AND jobs.user_id = $2
       ORDER BY reminders.reminder_date ASC`,
      [jobId, userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get reminders' });
  }
}

export async function createReminder(req, res) {
  const userId = req.user?.id;
  const { job_id, reminder_date, message, is_completed } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Check job ownership before creating reminder
    const jobCheck = await pool.query(
      'SELECT 1 FROM jobs WHERE id = $1 AND user_id = $2',
      [job_id, userId]
    );
    if (jobCheck.rowCount === 0) {
      return res.status(403).json({ error: 'Not authorized to add reminder to this job' });
    }

    const result = await pool.query(
      'INSERT INTO reminders (job_id, reminder_date, message, is_completed, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
      [job_id, reminder_date, message, is_completed || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
}

export async function updateReminder(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { reminder_date, message, is_completed } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `UPDATE reminders SET reminder_date=$1, message=$2, is_completed=$3, updated_at=NOW()
       WHERE id=$4 AND job_id IN (SELECT id FROM jobs WHERE user_id = $5)
       RETURNING *`,
      [reminder_date, message, is_completed, id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Reminder not found or unauthorized' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
}

export async function deleteReminder(req, res) {
  const userId = req.user?.id;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      `DELETE FROM reminders
       WHERE id = $1 AND job_id IN (SELECT id FROM jobs WHERE user_id = $2)`,
      [id, userId]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Reminder not found or unauthorized' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
}
