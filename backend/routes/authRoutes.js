const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken, authenticateToken, optionalAuth } = require('../utils/jwt');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  console.log('Registration request body:', req.body); // Debug log
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // --- Basic Validation ---
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    console.log('Missing fields:', { firstName: !!firstName, lastName: !!lastName, email: !!email, password: !!password, confirmPassword: !!confirmPassword });
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  // Consider adding more robust validation (e.g., email format, password strength)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
  }

  if (password.length < 6) { // Example: Minimum password length
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
  }

  try {
    // --- Check if user already exists ---
    const userExists = await db.query('SELECT * FROM users WHERE username = $1', [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }    // --- Hash password ---
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const passwordHash = await bcrypt.hash(password, salt); // Hash the password

    const newUserQuery = `
      INSERT INTO users (first_name, last_name, username, password_hash, membership_status, is_admin)
      VALUES ($1, $2, $3, $4, FALSE, FALSE)
      RETURNING id, username, first_name, last_name, membership_status, is_admin, created_at;
    `;
    // membership_status defaults to false, is_admin defaults to false as per schema

    const { rows } = await db.query(newUserQuery, [firstName, lastName, email, passwordHash]);
    const newUser = rows[0];

    // Generate JWT token for the new user
    const token = generateToken(newUser);

    // Respond with the created user and token
    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.username,
        membershipStatus: newUser.membership_status,
        isAdmin: newUser.is_admin,
        createdAt: newUser.created_at
      }
    });

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).send('Server error during registration');
  }
});

// POST /api/auth/join-club
router.post('/join-club', authenticateToken, async (req, res) => {
  console.log('Join club request - user:', req.user);
  console.log('Join club request - body:', req.body);

  const { userId, passcode, membershipPasscode } = req.body;
  const actualPasscode = passcode || membershipPasscode; // Support both field names

  // --- Basic Validation ---
  if (!actualPasscode) {
    return res.status(400).json({ msg: 'Please provide membership passcode' });
  }

  // If userId is provided, ensure it matches the authenticated user
  if (userId && parseInt(userId) !== req.user.id) {
    return res.status(403).json({ msg: 'Unauthorized: Cannot modify another user\'s membership' });
  }

  // --- Validate Passcode ---
  console.log('Comparing passcode:', actualPasscode, 'with env:', process.env.MEMBERSHIP_PASSCODE);
  if (actualPasscode !== process.env.MEMBERSHIP_PASSCODE) {
    return res.status(401).json({ msg: 'Invalid passcode. Access denied.' });
  }

  try {
    // --- Find user and check current membership status ---
    const userResult = await db.query('SELECT id, membership_status FROM users WHERE id = $1', [req.user.id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.membership_status === true) {
      return res.status(400).json({ msg: 'User is already a member' });
    }

    // --- Update membership_status to true ---
    const updateResult = await db.query(
      'UPDATE users SET membership_status = TRUE WHERE id = $1 RETURNING id, username, first_name, last_name, membership_status, is_admin',
      [req.user.id]
    );

    const updatedUser = updateResult.rows[0];

    // Generate new token with updated membership status
    const newToken = generateToken(updatedUser);

    res.json({
      msg: 'Membership successfully activated!',
      token: newToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.username,
        membershipStatus: updatedUser.membership_status,
        isAdmin: updatedUser.is_admin
      }
    });

  } catch (err) {
    console.error('Join club error:', err.message);
    res.status(500).send('Server error during membership activation');
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  console.log('Login request body:', req.body);
  const { email, password } = req.body;

  // --- Basic Validation ---
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter email and password' });
  }

  try {
    // --- Find user by email ---
    const userResult = await db.query(
      'SELECT id, username, first_name, last_name, password_hash, membership_status, is_admin, created_at FROM users WHERE username = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // --- Check password ---
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // --- Generate JWT token ---
    const token = generateToken(user);

    // --- Send response with token and user data ---
    res.json({
      msg: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.username,
        membershipStatus: user.membership_status,
        isAdmin: user.is_admin,
        createdAt: user.created_at
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error during login');
  }
});

// GET /api/auth/logout (JWT-based logout - client-side token removal)
router.post('/logout', (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // Server can optionally maintain a blacklist of tokens (advanced feature)
  res.json({ 
    msg: 'Logged out successfully',
    note: 'Please remove the token from client storage'
  });
});

// GET /api/auth/status (Check authentication status using JWT)
router.get('/status', optionalAuth, async (req, res) => {
  console.log('Auth status check - user from JWT:', req.user);
  
  if (req.user) {
    try {
      // Fetch fresh user data from database
      const userResult = await db.query(
        'SELECT id, username, first_name, last_name, membership_status, is_admin, created_at FROM users WHERE id = $1',
        [req.user.id]
      );

      if (userResult.rows.length === 0) {
        console.log('User not found in database for ID:', req.user.id);
        return res.status(200).json({ isAuthenticated: false, user: null });
      }

      const freshUser = userResult.rows[0];
      console.log('Fresh user data from DB:', freshUser);
      
      res.status(200).json({
        isAuthenticated: true,
        user: {
          id: freshUser.id,
          username: freshUser.username,
          firstName: freshUser.first_name,
          lastName: freshUser.last_name,
          email: freshUser.username,
          membershipStatus: freshUser.membership_status,
          isAdmin: freshUser.is_admin,
          createdAt: freshUser.created_at
        }
      });
    } catch (err) {
      console.error('Auth status error:', err);
      res.status(200).json({ isAuthenticated: false, user: null });
    }
  } else {
    res.status(200).json({ isAuthenticated: false, user: null });
  }
});

// POST /api/auth/grant-admin
router.post('/grant-admin', async (req, res) => {
  const { userId, adminPasscode } = req.body;

  // --- Basic Validation ---
  if (!userId || !adminPasscode) {
    return res.status(400).json({ msg: 'Please provide userId and adminPasscode' });
  }

  // --- Validate Admin Passcode ---
  if (adminPasscode !== process.env.ADMIN_PASSCODE) {
    return res.status(403).json({ msg: 'Invalid admin passcode. Forbidden.' });
  }

  try {
    // --- Find user and check current admin status ---
    const userResult = await db.query('SELECT id, username, is_admin FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.is_admin === true) {
      return res.status(400).json({ msg: 'User is already an admin' });
    }

    // --- Update is_admin to true ---
    const updateResult = await db.query(
      'UPDATE users SET is_admin = TRUE WHERE id = $1 RETURNING id, username, first_name, last_name, membership_status, is_admin',
      [userId]
    );
    
    const updatedUser = updateResult.rows[0];

    // Generate new token with updated admin status
    const newToken = generateToken(updatedUser);

    res.json({
      msg: 'Admin privileges granted successfully!',
      token: newToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.username,
        membershipStatus: updatedUser.membership_status,
        isAdmin: updatedUser.is_admin
      }
    });

  } catch (err) {
    console.error('Grant admin error:', err.message);
    res.status(500).send('Server error during admin status update');
  }
});




module.exports = router;