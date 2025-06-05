import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { getReminders, createReminder, updateReminder, deleteReminder } from '../controllers/reminderController.mjs';

const router = express.Router();
router.use(authenticateToken);
router.get('/:jobId', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
