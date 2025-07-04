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
const allowedOrigins = [
  'http://localhost:5173',
  'https://excel-plotiply-app.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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