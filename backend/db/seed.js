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
    }    const messagesToCreate = [
      { 
        title: 'The Future of Decentralized Finance', 
        textContent: 'Recent developments in DeFi protocols suggest a paradigm shift that most aren\'t seeing yet. The convergence of institutional adoption and regulatory clarity is creating unprecedented opportunities for strategic positioning. Three key indicators point to a transformation that will reshape traditional finance within the next 18 months.', 
        userId: createdUsers[0].id 
      }, // Alice (non-member)
      { 
        title: 'Strategic Market Positioning in Q4', 
        textContent: 'Three key indicators point to an unprecedented opportunity in emerging markets. The correlation between geopolitical stability and tech infrastructure investment is reaching an inflection point. Smart money is quietly positioning in sectors that institutional investors haven\'t discovered yet. The data suggests we\'re at the beginning of a major cycle shift.', 
        userId: createdUsers[1].id 
      }, // Bob (member)
      { 
        title: 'AI Infrastructure Investment Thesis', 
        textContent: 'The next wave of AI infrastructure will be built on principles that current players are ignoring. Edge computing combined with specialized hardware creates a moat that\'s still available to capture. Most investors are focusing on the obvious plays while the real value is being created in the infrastructure layer. This is a 10-year opportunity window.', 
        userId: createdUsers[2].id 
      }, // Charlie (admin & member)
      { 
        title: 'Regulatory Arbitrage Opportunities', 
        textContent: 'Cross-jurisdictional analysis reveals significant gaps that sophisticated players can leverage. The window is closing, but there\'s still time for strategic positioning. New frameworks emerging in key markets are creating temporary advantages for those who understand the regulatory landscape. The compliance overhead is actually becoming a competitive moat.', 
        userId: createdUsers[1].id 
      }, // Bob (member)
      { 
        title: 'Supply Chain Disruption Patterns', 
        textContent: 'Analyzing 15 years of supply chain data reveals predictable patterns that most companies miss. The next disruption is already visible if you know where to look. Historical precedents suggest we\'re entering a period where agility trumps efficiency. Companies that adapt their supply chain strategy now will have significant advantages over the next decade.', 
        userId: createdUsers[3].id 
      }, // Diana (non-member)
      { 
        title: 'Energy Transition Investment Framework', 
        textContent: 'The energy transition is creating asymmetric opportunities that traditional energy investors are missing. Battery technology advances are outpacing adoption curves, creating value gaps in specific segments. Policy alignment across major economies is creating a tailwind that won\'t last forever. The next 24 months are critical for positioning.', 
        userId: createdUsers[2].id 
      }, // Charlie (admin & member)
      { 
        title: 'Real Estate Technology Convergence', 
        textContent: 'PropTech is finally reaching maturity, but the real opportunities are in the convergence layers. IoT, AI, and blockchain are creating new property categories that traditional real estate hasn\'t recognized yet. Demographics and technology trends are aligning to create a perfect storm for early adopters.', 
        userId: createdUsers[0].id 
      } // Alice (non-member)
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