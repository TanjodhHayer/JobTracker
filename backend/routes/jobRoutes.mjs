import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { getJobs, createJob, updateJob, deleteJob } from '../controllers/jobController.mjs';

const router = express.Router();
router.use(authenticateToken);

router.get('/', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
