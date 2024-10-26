const express = require('express');
const { getLocationNews } = require('../controller/llamController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// router.get('/location', GeocodingController.getLocationNews);
router.get('/district', getLocationNews);


module.exports = router;
