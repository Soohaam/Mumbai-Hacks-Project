// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

  app.get('/api/heatmap', async (req, res) => {
    try {
      const data = await Heatmap.find(); // Fetch data from MongoDB
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
