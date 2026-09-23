const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const seedData = require('./seed');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database & Auto-Seed
const initServer = async () => {
  await connectDB();
  await seedData();
};
initServer();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS configuration allowing localhost Vite dev server
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Hub Learning Website API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hubs', require('./routes/hubRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// 404 Handler for Unrecognized Endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Hub Learning Backend running on port ${PORT}`);
  console.log(`📡 API Endpoints available at: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});

module.exports = app;
