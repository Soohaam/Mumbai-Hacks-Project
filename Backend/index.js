const express = require('express');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors')


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);


app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Import routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); // Use userRoutes as middleware

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
