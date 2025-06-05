import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteController.mjs';

const router = express.Router();
router.use(authenticateToken);
router.get('/:jobId', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
