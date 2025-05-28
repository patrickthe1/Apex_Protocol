const express = require('express');
const app = express();
const port = 3000;
const db = require('./config/db');
require('dotenv').config();
const testRoutes = require('./routes/testRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Apex Protocol Backend!');
});

app.use('/api/test', testRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});