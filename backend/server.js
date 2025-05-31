const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8080;
const db = require('./config/db');
require('dotenv').config();
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

// CORS Configuration for production deployment
const allowedOrigins = [
  'http://localhost:3000',  // Development
  'https://apex-protocol-frontend.netlify.app',  // Current frontend URL (no trailing slash)
  'https://683a1ac4c7e8a000088f1549--apex-protocol-frontend.netlify.app', // Backup URL
  process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash from env var
].filter(Boolean);

console.log('🔍 CORS Debug - Allowed Origins:', allowedOrigins);
console.log('🔍 CORS Debug - FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS Debug - Request origin:', origin);
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS - Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS - Origin blocked:', origin);
      console.log('❌ Allowed origins are:', allowedOrigins);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

console.log('🚀 JWT Authentication System Initialized');
console.log('Environment:', process.env.NODE_ENV);
console.log('Allowed origins:', allowedOrigins);
console.log('Frontend URL from env:', process.env.FRONTEND_URL);

app.get('/', (req, res) => {
  res.send('Hello from Apex Protocol Backend!');
});

app.use('/api/test', testRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/messages',messageRoutes);

// Add this to server.js temporarily for debugging
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin,
    allowedOrigins: [
      'http://localhost:3000',
      process.env.FRONTEND_URL,
      'https://683a1ac4c7e8a000088f1549--apex-protocol-frontend.netlify.app'
    ],
    frontendUrl: process.env.FRONTEND_URL
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});