# Project Title

## Description
This project is a web application that includes user authentication, integrates with Shopify data, and uses Socket.IO for real-time features. The backend is built with Node.js and Express, while the frontend utilizes React. 

## Technologies Used
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.IO
- **Frontend**: React, Axios, Vite
- **Middleware**: CORS, Cookie Parser
- **Authentication**: JSON Web Tokens (JWT)

## Installation Instructions

Before cloning the repository, make sure you have Node.js and npm installed on your machine.

1. **Clone the repository**
   ```bash
   git clone <repository-url>

Navigate to the project directory
cd <project-directory>
Install Node modules for the backend


cd backend
npm install
Install Node modules for the client

cd ../client
npm install
Running the Application
Start the backend server

cd backend
npm start
Start the frontend application

cd ../client
npm run dev
Environment Variables
Create a .env file in the backend directory with the following variables:


MONGO_URI=<your-mongodb-uri>
PORT=5000
Socket.IO Connection
Ensure that the frontend is running on http://localhost:5173 to establish a connection with the backend Socket.IO server.

