import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import {Response , Request ,NextFunction} from 'express';

// Load env from server/config.env
dotenv.config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
// Increase body size limits to handle base64 images
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not set in environment variables');
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Rubiks API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Rubiks server running on port ${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_SERVICE}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI}`);
});
