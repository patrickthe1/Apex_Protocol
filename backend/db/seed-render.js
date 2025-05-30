// Production Render Database Seed Script
require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Render PostgreSQL connection configuration
const pool = new Pool({
  connectionString: 'postgresql://apex_protocol_user:BDlrWHNn6dq7P7dWdgw9Z9d6XfAEe9GO@dpg-d0t0cg49c44c738k3ce0-a.frankfurt-postgres.render.com/apex_protocol',
  ssl: {
    rejectUnauthorized: false  // Required for Render connections
  }
});

async function seedRenderDatabase() {
  try {
    console.log('🚀 Starting Render database seeding...');
    
    // Test connection first
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful at:', testResult.rows[0].now);

    // Check if tables exist
    const tablesExist = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'messages')
    `);
    
    if (tablesExist.rows.length < 2) {
      console.error('❌ Tables do not exist. Please create the schema first.');
      console.log('Run this in your Render database console:');
      console.log(`
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    membership_status BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    text_content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);
      return;
    }

    console.log('✅ Tables found: users, messages');

    // Clear existing data (production safe - only clears if tables are empty)
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const messageCount = await pool.query('SELECT COUNT(*) FROM messages');
    
    console.log(`📊 Current data: ${userCount.rows[0].count} users, ${messageCount.rows[0].count} messages`);
    
    if (userCount.rows[0].count > 0) {
      console.log('⚠️  Database already has data. Skipping destructive operations.');
      console.log('If you want to reseed, manually clear the tables first.');
      return;
    }

    console.log('🗑️  Clearing existing data...');
    await pool.query('DELETE FROM messages;');
    await pool.query('DELETE FROM users;');
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    await pool.query('ALTER SEQUENCE messages_id_seq RESTART WITH 1;');

    console.log('✅ Cleared existing data.');

    // --- Create Users ---
    console.log('👥 Creating users...');
    const usersToCreate = [
      { 
        firstName: 'Alice', 
        lastName: 'Wonder', 
        email: 'alice@example.com', 
        password: 'password123', 
        membership_status: false, 
        is_admin: false 
      },
      { 
        firstName: 'Bob', 
        lastName: 'Johnson', 
        email: 'bob@example.com', 
        password: 'password123', 
        membership_status: true, 
        is_admin: false 
      },
      { 
        firstName: 'Charlie', 
        lastName: 'Admin', 
        email: 'charlie@example.com', 
        password: 'password123', 
        membership_status: true, 
        is_admin: true 
      },
      { 
        firstName: 'Diana', 
        lastName: 'Prince', 
        email: 'diana@example.com', 
        password: 'password123', 
        membership_status: false, 
        is_admin: false 
      },
    ];

    const createdUsers = [];
    for (const userData of usersToCreate) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);
      const res = await pool.query(
        'INSERT INTO users (first_name, last_name, username, password_hash, membership_status, is_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userData.firstName, userData.lastName, userData.email, passwordHash, userData.membership_status, userData.is_admin]
      );
      createdUsers.push(res.rows[0]);
      console.log(`✅ Created user: ${userData.email} (ID: ${res.rows[0].id}) - Member: ${userData.membership_status}, Admin: ${userData.is_admin}`);
    }

    // --- Create Messages ---
    console.log('💬 Creating messages...');
    const messagesToCreate = [
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

    for (let i = 0; i < messagesToCreate.length; i++) {
      const msgData = messagesToCreate[i];
      const result = await pool.query(
        'INSERT INTO messages (title, text_content, user_id) VALUES ($1, $2, $3) RETURNING id',
        [msgData.title, msgData.textContent, msgData.userId]
      );
      console.log(`✅ Created message ${i + 1}/${messagesToCreate.length}: "${msgData.title}" (ID: ${result.rows[0].id})`);
    }

    // Final verification
    const finalUserCount = await pool.query('SELECT COUNT(*) FROM users');
    const finalMessageCount = await pool.query('SELECT COUNT(*) FROM messages');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Final counts: ${finalUserCount.rows[0].count} users, ${finalMessageCount.rows[0].count} messages`);
    
    // Display test accounts for production use
    console.log('\n🔑 Test Accounts Created:');
    console.log('1. alice@example.com (password123) - Guest User');
    console.log('2. bob@example.com (password123) - Member');
    console.log('3. charlie@example.com (password123) - Admin + Member');
    console.log('4. diana@example.com (password123) - Guest User');
    console.log('\n🎯 Passcodes:');
    console.log(`- Membership: ${process.env.MEMBERSHIP_PASSCODE || 'APEXPROTOCOL-ELITE77'}`);
    console.log(`- Admin: ${process.env.ADMIN_PASSCODE || 'APEXADMIN777'}`);

  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    console.error('Stack trace:', err.stack);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed.');
  }
}

// Run the seeding function
seedRenderDatabase().then(() => {
  console.log('✅ Seed script completed.');
  process.exit(0);
}).catch((err) => {
  console.error('💥 Seed script failed:', err);
  process.exit(1);
});
