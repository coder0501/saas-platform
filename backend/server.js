// backend/server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import Express framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const cookieParser = require('cookie-parser'); // Import cookie-parser for cookie handling
const { startShopifyDataEmission } = require('./controllers/shopifyController'); // Import function to emit Shopify data
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const shopify = require('./routes/shopify'); // Import Shopify routes
const cors = require('cors'); // Import CORS middleware
const { Server } = require('socket.io'); // Import Socket.IO server
const http = require('http'); // Import HTTP module
const { protect } = require('./middleware/authMiddleware'); // Import middleware for route protection

const app = express(); // Create Express application
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { // Create Socket.IO server
  cors: {
    origin: 'http://localhost:5173', // Allow specific origin
    credentials: true, // Allow credentials
  },
});

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({ // Configure CORS
  origin: 'http://localhost:5173', // Allow specific origin
  credentials: true, // Allow credentials
  methods: ['GET', 'POST'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/shopify', protect, shopify(io)); // Protected Shopify routes

// Emit Shopify data with Socket.io
startShopifyDataEmission(io); // Start emitting Shopify data

// Socket.IO connection
io.on('connection', (socket) => { // Listen for new Socket.IO connections
  console.log('User connected'); // Log user connection
  socket.on('disconnect', () => { // Listen for disconnection
    console.log('User disconnected'); // Log user disconnection
  });
});

// Start server
const PORT = process.env.PORT || 5000; // Set port from environment or default to 5000
mongoose.connect(process.env.MONGO_URI) // Connect to MongoDB
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start server and log message
  }).catch(err => console.error(err)); // Log any connection errors
