import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import packageRoutes from './routes/packages.js';
import { createServerlessHandler } from '@vercel/node'; // Required for Vercel

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);

// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`);
// });

// Export the app as a serverless function
export default createServerlessHandler(app);