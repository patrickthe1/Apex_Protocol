const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./config/passport-config');
const port = 8080;
const db = require('./config/db');
require('dotenv').config();
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Import message routes
const { ensureAuthenticated } = require('./middleware/authMiddleware'); // If you plan to use it directly in server.js for some routes

initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false, // Don't create session until something stored
  // cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production (HTTPS)
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
  console.log(`Server running on http://localhost:${port}`);
});