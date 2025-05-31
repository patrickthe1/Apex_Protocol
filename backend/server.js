const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const initializePassport = require('./config/passport-config');
const port = process.env.PORT || 8080;
const db = require('./config/db');
require('dotenv').config();
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Import message routes
const { ensureAuthenticated } = require('./middleware/authMiddleware'); // If you plan to use it directly in server.js for some routes

initializePassport(passport);

// CORS Configuration for production deployment
// Backend server.js CORS debug
const allowedOrigins = [
  'http://localhost:3000',  // Development
  process.env.FRONTEND_URL, // Should be your Netlify URL
  'https://683a1ac4c7e8a000088f1549--apex-protocol-frontend.netlify.app' // Your actual Netlify URL
];

console.log('🔍 CORS Debug - Allowed Origins:', allowedOrigins);
console.log('🔍 CORS Debug - FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS Debug - Request origin:', origin);
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS - Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS - Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Log CORS configuration for debugging
console.log('CORS Configuration:');
console.log('Environment:', process.env.NODE_ENV);
console.log('Allowed origins:', allowedOrigins);
console.log('Frontend URL from env:', process.env.FRONTEND_URL);
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false, // Don't create session until something stored
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport Middleware
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Allow Passport to use Express sessions

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