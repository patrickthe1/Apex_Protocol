
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('./db'); // Your database connection pool

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    // 1. Find user by email (username in our DB)
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [email]);
      if (result.rows.length === 0) {
        return done(null, false, { message: 'No user with that email' });
      }
      const user = result.rows[0];

      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (isMatch) {
        return done(null, user); // Authentication successful, pass user object
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e); // Database error or other error
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  // 3. Serialize user: Store user ID in session
  passport.serializeUser((user, done) => done(null, user.id));

  // 4. Deserialize user: Fetch full user object from DB using ID from session
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query('SELECT id, username, first_name, last_name, membership_status, is_admin FROM users WHERE id = $1', [id]);
      // Note: Exclude password_hash from being attached to req.user
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      }
      return done(null, false, {message: 'User not found during deserialization'}); // Should not happen if ID in session is valid
    } catch (e) {
      return done(e);
    }
  });
}

module.exports = initialize;