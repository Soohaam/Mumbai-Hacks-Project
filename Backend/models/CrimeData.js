// models/CrimeData.js
const mongoose = require('mongoose');

const crimeDataSchema = new mongoose.Schema({
    state: String,
    district: String,
    year: Number,
    total_crime: Number,
    lat: Number,
    lon: Number
});

const CrimeData = mongoose.model('CrimeData', crimeDataSchema);

module.exports = CrimeData;
