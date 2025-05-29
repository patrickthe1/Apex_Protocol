const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const passport = require('passport');

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
    }

    // --- Hash password ---
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

    // Respond with the created user (excluding password_hash)
    res.status(201).json({
      msg: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
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

// ... existing code (imports, /register route) ...

// POST /api/auth/join-club
router.post('/join-club', async (req, res) => {
  const { userId, passcode } = req.body;

  // --- Basic Validation ---
  if (!userId || !passcode) {
    return res.status(400).json({ msg: 'Please provide userId and passcode' });
  }

  // --- Validate Passcode ---
  if (passcode !== process.env.MEMBERSHIP_PASSCODE) {
    return res.status(401).json({ msg: 'Invalid passcode. Access denied.' });
  }

  try {
    // --- Find user and check current membership status ---
    const userResult = await db.query('SELECT id, membership_status FROM users WHERE id = $1', [userId]);

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
      [userId]
    );

    const updatedUser = updateResult.rows[0];

    res.json({
      msg: 'Membership successfully activated!',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
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
router.post('/login', (req, res, next) => {
  console.log('Login request body:', req.body); // Debug log
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle error (e.g., database error)
    }
    if (!user) {
      // Authentication failed (e.g., wrong email/password)
      // info contains the message from LocalStrategy's done(null, false, { message: ... })
      return res.status(401).json({ msg: info.message || 'Login failed. Please check your credentials.' });
    }
    // Authentication successful, establish a session
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Session established
      // Send back user info (excluding sensitive data like password_hash)
      const { password_hash, ...userWithoutPassword } = user;
      return res.json({
        msg: 'Logged in successfully',
        user: userWithoutPassword
      });
    });
  })(req, res, next);
});

// GET /api/auth/logout (Example logout route)
router.get('/logout', (req, res, next) => {
  req.logout(function(err) { // req.logout requires a callback function
    if (err) { return next(err); }
    req.session.destroy((err) => { // Optional: explicitly destroy session
        if (err) {
            // Handle error case...
            console.log("Session destruction error:", err);
            return res.status(500).json({ msg: "Error logging out" });
        }
        res.clearCookie('connect.sid'); // Optional: clear the session cookie if name is known
        res.json({ msg: 'Logged out successfully' });
    });
  });
});

// GET /api/auth/status (Example route to check login status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) { // passport adds isAuthenticated() to the request
    const { password_hash, ...userWithoutPassword } = req.user;
    res.json({
      isAuthenticated: true,
      user: userWithoutPassword
    });
  } else {
    res.json({ isAuthenticated: false, user: null });
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
    return res.status(403).json({ msg: 'Invalid admin passcode. Forbidden.' }); // 403 Forbidden for auth-like errors
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

    res.json({
      msg: 'Admin privileges granted successfully!',
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
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