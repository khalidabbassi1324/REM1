const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Use CORS for cross-origin requests (needed for local development)
app.use(cors());

// MySQL connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '4123',
  database: 'crud_app',
});

// Middleware to handle JSON data
app.use(express.json());

// Fetch all tables in the database
app.get('/api/tables', (req, res) => {
  connection.query('SHOW TABLES', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching tables' });
      return;
    }
    const tableNames = results.map(result => Object.values(result)[0]);
    res.json(tableNames);
  });
});

// Fetch user email by name
app.get('/api/user/:name', (req, res) => {
  const name = req.params.name;
  connection.query(
    'SELECT email FROM users WHERE name = ?',
    [name],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error fetching user data' });
        return;
      }
      if (results.length > 0) {
        res.json(results[0]); // Return the first matched user
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  );
});

// Add a new user
app.post('/api/user', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  connection.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error adding user' });
        return;
      }
      res.status(201).json({ message: 'User added successfully' });
    }
  );
});

// Delete a user by name
app.delete('/api/user/:name', (req, res) => {
  const name = req.params.name;
  connection.query(
    'DELETE FROM users WHERE name = ?',
    [name],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error deleting user' });
        return;
      }
      if (results.affectedRows > 0) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
