// models/Heatmap.js
const mongoose = require('mongoose');

const HeatmapSchema = new mongoose.Schema({
  state: String,
  district: String,
  normalized_crime: Number,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model('Heatmap', HeatmapSchema);
