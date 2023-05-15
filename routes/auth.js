import express from 'express';
const router = express.Router();
import { db } from '../db/index.js';

// Create the users table if it does not exist
db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT
  )`).run();


// API endpoint to register a new user
router.post('/register', (req, res) => {
    const { email, password, name } = req.body;

    // Check if a user with the same email already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    // Create a new user object
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, password);

    if (result.changes === 0) {
        return res.status(500).json({ message: 'Failed to register user' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'User registered successfully', user: user });
});


// API endpoint to validate and return user data for login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user with the provided email and password
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password);

    if (user) {
        res.status(200).json({ message: 'User logged in successfully', user: user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// API endpoint to retrieve user data by ID
router.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    // Find the user with the provided ID
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(userId);

    if (user) {
        res.status(200).json({ user: user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


/* Exporting the router. */
export default router;