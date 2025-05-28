require('dotenv').config();
const {Pool} = require('pg');
 
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT,
});

pool.connect((err,client,release) => {
    if (err) {
        console.error('Error connecting to the database', err.stack);
    }

    client.query('SELECT NOW()', (err, res) => {
        release();
        if (err) {
            console.error('Error executing query', err.stack);
        } else {
            console.log('Database connected successfully:', res.rows[0].now);
        }
    });
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool,
}