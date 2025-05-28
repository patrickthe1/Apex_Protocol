require('dotenv').config({ path: '../.env' }); // Adjust path to .env if seed.js is in a subdirectory
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Your database connection pool

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data (optional, be careful with this in production!)
    // For a test environment, this ensures a clean slate.
    await db.query('DELETE FROM messages;');
    await db.query('DELETE FROM users;');
    // Reset sequence for IDs if you are deleting all rows
    await db.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    await db.query('ALTER SEQUENCE messages_id_seq RESTART WITH 1;');

    console.log('Cleared existing data.');

    // --- Create Users ---
    const usersToCreate = [
      { firstName: 'Alice', lastName: 'Wonder', email: 'alice@example.com', password: 'password123', membership_status: false, is_admin: false },
      { firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com', password: 'password123', membership_status: true, is_admin: false },
      { firstName: 'Charlie', lastName: 'Admin', email: 'charlie@example.com', password: 'password123', membership_status: true, is_admin: true },
      { firstName: 'Diana', lastName: 'Prince', email: 'diana@example.com', password: 'password123', membership_status: false, is_admin: false },
    ];

    const createdUsers = [];
    for (const userData of usersToCreate) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);
      const res = await db.query(
        'INSERT INTO users (first_name, last_name, username, password_hash, membership_status, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userData.firstName, userData.lastName, userData.email, passwordHash, userData.membership_status, userData.is_admin]
      );
      createdUsers.push(res.rows[0]);
      console.log(`Created user: ${userData.email} (ID: ${res.rows[0].id})`);
    }

    // --- Create Messages ---
    // Ensure createdUsers has users before proceeding
    if (createdUsers.length < 3) {
        console.error("Not enough users created to seed messages properly.");
        return;
    }

    const messagesToCreate = [
      { title: 'Hello World', textContent: 'My first post!', userId: createdUsers[0].id }, // Alice (non-member)
      { title: 'Club Rules', textContent: 'Welcome to the club, members!', userId: createdUsers[1].id }, // Bob (member)
      { title: 'Admin Announcement', textContent: 'Important update from admin.', userId: createdUsers[2].id }, // Charlie (admin & member)
      { title: 'Thoughts on Privacy', textContent: 'A public thought.', userId: createdUsers[0].id }, // Alice (non-member)
      { title: 'Project Ideas', textContent: 'Let\'s discuss new projects.', userId: createdUsers[1].id } // Bob (member)
    ];

    for (const msgData of messagesToCreate) {
      await db.query(
        'INSERT INTO messages (title, text_content, user_id) VALUES ($1, $2, $3)',
        [msgData.title, msgData.textContent, msgData.userId]
      );
      console.log(`Created message: "${msgData.title}" by user ID ${msgData.userId}`);
    }

    console.log('Database seeding completed successfully!');

  } catch (err) {
    console.error('Error during database seeding:', err);
  } finally {
    // End the pool's client connections
    // Important if you are running this script as a standalone process
    // and not part of your main application lifecycle
    await db.pool.end();
    console.log('Database pool closed.');
  }
}

seedDatabase();