import './config.mjs'; // load env first
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.mjs';
import jobRoutes from './routes/jobRoutes.mjs';
import noteRoutes from './routes/noteRoutes.mjs';
import reminderRoutes from './routes/reminderRoutes.mjs';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/reminders', reminderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
