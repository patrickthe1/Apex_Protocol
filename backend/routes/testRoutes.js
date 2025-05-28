const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Route to get all users (for testing)
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, first_name, last_name, username, membership_status, is_admin, created_at FROM users');
    // We exclude password_hash from being sent to the client
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route to get all messages (for testing)
router.get('/messages', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, title, text_content, user_id, timestamp FROM messages');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;