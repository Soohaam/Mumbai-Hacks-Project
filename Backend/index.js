const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per window
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/women_safety', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Define a Mongoose schema and model for storing crime data
const crimeDataSchema = new mongoose.Schema({
  location: String,
  lat: Number,
  lon: Number,
  rape: Number,
  murder: Number,
  kidnapping: Number
});

const CrimeData = mongoose.model('CrimeData', crimeDataSchema);

// Endpoint to fetch heatmap data
app.get('/api/heatmap', async (req, res) => {
  try {
    const crimeData = await CrimeData.find();
    const heatmapData = crimeData.map(item => {
      const intensity = item.rape + item.murder + item.kidnapping;
      return {
        lat: item.lat,
        lon: item.lon,
        intensity: intensity // Total intensity for the heatmap
      };
    });

    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).send('Error fetching data from database');
  }
});

// Import additional routes (e.g., user routes)
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes); // Use userRoutes as middleware

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
