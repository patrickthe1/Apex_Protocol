// Test script to validate database connection
require('dotenv').config();
const {Pool} = require('pg');

console.log('Testing database connection...');
console.log('Connection string:', process.env.DB_CONNECTION_STRING ? 'Found' : 'Missing');

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000, // 30 seconds
  max: 2 // Maximum number of connections
});

async function testConnection() {
  try {
    console.log('Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    console.log('Testing query...');
    const result = await client.query('SELECT NOW(), version()');
    console.log('✅ Query successful!');
    console.log('Current time:', result.rows[0].now);
    console.log('PostgreSQL version:', result.rows[0].version);
    
    // Test if our tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('✅ Available tables:', tablesResult.rows.map(row => row.table_name));
    
    client.release();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
