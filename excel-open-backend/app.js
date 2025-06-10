import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import uploadhistoryRoute from './routes/uploadhistoryRoute.js';
import analyseRoute from './routes/analyze.js'
import adminRoutes from './routes/admin.js';
import profileRoute from'./routes/Profile.js';
import errorHandler from './middleware/errorMiddleware.js';
import activityRoutes from'./routes/activity.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/upload', uploadRoute); 
app.use('/api',uploadhistoryRoute,analyseRoute);
app.use('/api/profile', profileRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);


app.use('/api/activities', activityRoutes);

// Error handling
app.use(errorHandler);

export default app;