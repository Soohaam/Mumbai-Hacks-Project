const express = require('express');
const { getLocationNews } = require('../controller/llamController');
const { chatbotHandler } = require('../controller/chatController');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Existing route
router.get('/district', getLocationNews);

// New prediction route
router.post('/predict', async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const response = await axios.post('http://localhost:5000/api/user/predict', {
            latitude,
            longitude
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error predicting danger level:', error);
        res.status(500).json({ error: 'Error predicting danger level' });
    }
});

// router.get('/location', GeocodingController.getLocationNews);
router.get('/district', getLocationNews);
router.post('/chat', chatbotHandler);



module.exports = router;
