// backend/controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// JWT generation helper
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, role: user.role, username: user.username },
        process.env.JWT_Secret_Key,
        {
            expiresIn: '1h', // Set to expire in 1 minute
        }
    );
};


// Register a new user
const registerUser = async (req, res) => {

    const { username, email, password } = req.body;
    try {

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with the secret key
        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered', newUser });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login an existing user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT and set cookie
        const token = generateToken(user);

        res.cookie('token', token, { httpOnly: true, secure: false, path: '/', sameSite: 'Lax', maxAge: 3600000 });
        res.status(200).json({ message: 'User logged in', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { registerUser, loginUser };




