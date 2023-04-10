const express = require('express');
const router = express.Router();
// Local array to store user data
let users = [{ id: 'abc123', email: 'test@example.com', password: 'password123', firstName: 'John', }];


// API endpoint to register a new user
router.post('/register', (req, res) => {
    const { email, password, firstName } = req.body;

    // Generate a unique user ID
    const userId = Math.random().toString(36).substring(7);

    // Create a new user object
    const newUser = {
        id: userId,
        email: email,
        password: password,
        firstName: firstName,
    };

    // Add the new user to the local array
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// API endpoint to validate and return user data for login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user with the provided email and password
    const user = users.find((u) => u.email === email && u.password === password);
    // console.log('email:', email);
    // console.log('password:', password);
    // console.log('users:', users);
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
    const user = users.find((u) => u.id === userId);

    if (user) {
        res.status(200).json({ user: user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

/* Exporting the router. */
module.exports = router;