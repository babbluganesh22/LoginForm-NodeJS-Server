const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust as needed
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'customerdb'
});

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    pool.query('INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, username, password], (err) => {
            if (err) {
                console.error('Error during signup:', err);
                res.status(500).send('Error during signup');
                return;
            }
            res.send('Signup successful');
        });
});

// Signin endpoint
app.post('/signin', (req, res) => {
    const { emailOrUsername, password } = req.body;

    pool.query('SELECT * FROM users WHERE email = ? OR username = ? AND password = ?',
        [emailOrUsername, emailOrUsername, password], (err, results) => {
            if (err) {
                console.error('Error during signin:', err);
                res.status(500).send('Error during signin');
                return;
            }

            if (results.length > 0) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
