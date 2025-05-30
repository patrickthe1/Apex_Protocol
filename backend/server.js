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
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['https://apex-protocol.netlify.app']) // Use environment variable or fallback
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true, // Allow cookies/session to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});