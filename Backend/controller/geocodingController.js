const axios = require('axios');

const getDistrict = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'LocationNewsApp/1.0'
        }
      }
    );

    const address = response.data.address;
    console.log(address);
    
    const district =  address.state_district;
    const country=address.country;
    const state=address.state;

    res.json({ district,state,country });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to get district information' });
  }
};

module.exports = { getDistrict };
