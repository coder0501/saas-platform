// backend/routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming you have a User model to fetch user data

// Registration route
router.post('/signup', registerUser);

// Login route
router.post('/login', loginUser);

// Middleware to verify JWT
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token; // Read token from HttpOnly cookie

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Decode the token to get user information
    let decodedToken;
    try {
        decodedToken = jwt.decode(token);
        if (!decodedToken || !decodedToken.userId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token format' });
    }

    // Fetch the user's secretKey from the database
    const user = await User.findById(decodedToken.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Now verify the token using the user's secretKey
    jwt.verify(token, process.env.JWT_Secret_Key, (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = userData; // Attach the verified user data to the request object
        next();
    });
};

// Status check endpoint
router.get('/status', authenticateToken, (req, res) => {

    // If token is valid, return the user info
    res.status(200).json({ user: req.user });
});

module.exports = router;