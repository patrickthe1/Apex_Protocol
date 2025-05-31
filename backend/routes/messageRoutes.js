const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your database connection
const { ensureAuthenticated, ensureAdmin } = require('../middleware/authMiddleware');
const { optionalAuth } = require('../utils/jwt');

router.post('/',ensureAuthenticated, async (req,res) => {
    const {title,textContent} = req.body;
    const userId = req.user.id;

     if (!title || !textContent) {
    return res.status(400).json({ msg: 'Please provide both title and text content for the message.' });
  }
   
   if (!userId) {
    // This should technically be caught by ensureAuthenticated, but as a safeguard:
    return res.status(401).json({ msg: 'User not authenticated.' });
  }

   try {
    // --- Store new message in database ---
    // Recall: Message Model: title, timestamp, text_content, and a reference to the user_id
    // timestamp defaults to CURRENT_TIMESTAMP in the schema
    const newMessageQuery = `
      INSERT INTO messages (title, text_content, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, text_content, user_id, timestamp;
    `;

    const { rows } = await db.query(newMessageQuery, [title, textContent, userId]);
    const newMessage = rows[0];

    res.status(201).json({
      msg: 'Message created successfully',
      message: newMessage
    });

  } catch (err) {
    console.error('Message creation error:', err.message);
    res.status(500).send('Server error during message creation');
  }
})

// GET /api/messages - Fetch all messages with conditional author visibility
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query;
    let messages;

    // Check if user is authenticated and is a member
    if (req.user && req.user.membershipStatus === true) {
      // User is a member: Fetch messages with author details
      query = `
        SELECT 
          m.id, 
          m.title, 
          m.text_content, 
          m.timestamp, 
          u.first_name AS "authorFirstName", 
          u.last_name AS "authorLastName"
        FROM messages m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.timestamp DESC;
      `;
      const result = await db.query(query);
      messages = result.rows.map(msg => ({
        id: msg.id,
        title: msg.title,
        textContent: msg.text_content,
        timestamp: msg.timestamp,
        authorFullName: `${msg.authorFirstName} ${msg.authorLastName}`
      }));
    } else {
      // User is not a member or not authenticated: Fetch messages without author details
      query = `
        SELECT 
          id, 
          title, 
          text_content, 
          timestamp 
        FROM messages 
        ORDER BY timestamp DESC;
      `;
      const result = await db.query(query);
      messages = result.rows.map(msg => ({ // Ensure consistent structure, author will be undefined
        id: msg.id,
        title: msg.title,
        textContent: msg.text_content,
        timestamp: msg.timestamp,
        // authorFullName: "Anonymous" // Or simply omit the author field
      }));
    }

    res.json(messages);

  } catch (err) {
    console.error('Error fetching messages:', err.message);
    res.status(500).send('Server error while fetching messages');
  }
});

router.delete('/:messageId', ensureAuthenticated, ensureAdmin, async (req, res) => {
  const { messageId } = req.params;

  if (isNaN(parseInt(messageId))) {
    return res.status(400).json({ msg: 'Invalid message ID format.' });
  }

  try {
    // Check if the message exists before attempting to delete
    const messageExistsResult = await db.query('SELECT id FROM messages WHERE id = $1', [messageId]);
    if (messageExistsResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Message not found.' });
    }

    // --- Delete message from database ---
    const deleteResult = await db.query('DELETE FROM messages WHERE id = $1 RETURNING id', [messageId]);

    if (deleteResult.rowCount > 0) {
      res.json({ msg: `Message with ID ${messageId} deleted successfully.` });
    } else {
      // This case should ideally be caught by the check above, but as a fallback:
      res.status(404).json({ msg: 'Message not found or already deleted.' });
    }

  } catch (err) {
    console.error('Message deletion error:', err.message);
    res.status(500).send('Server error during message deletion');
  }
});

module.exports = router;