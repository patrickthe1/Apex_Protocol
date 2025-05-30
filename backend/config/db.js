require('dotenv').config();
const {Pool} = require('pg');
 
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false // Required for external databases like Render
  }
});

// Test the database connection
pool.connect()
  .then(client => {
    console.log('Database connected successfully');
    return client.query('SELECT NOW()')
      .then(res => {
        console.log('Database connection test successful:', res.rows[0].now);
        client.release();
      })
      .catch(err => {
        console.error('Error executing test query:', err.stack);
        client.release();
      });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.stack);
  });

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool,
}