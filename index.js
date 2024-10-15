const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Password123!',
  database: 'test'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static('public'));

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
