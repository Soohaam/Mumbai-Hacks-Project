const Groq = require('groq-sdk');
const moment = require('moment');
const logger = require('../utils/logger');
const { default: axios } = require('axios');

// Initialize the Groq client with the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper function to get district, state, and country information
const getDistrictInfo = async (latitude, longitude) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
    {
      headers: {
        'User-Agent': 'LocationNewsApp/1.0',
      },
    }
  );
  const address = response.data.address;
  return {
    district: address.state_district,
    state: address.state,
    country: address.country,
  };
};

// Controller function that combines district info and LLAMA model news
const getLocationNews = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Step 1: Get location information
    const locationInfo = await getDistrictInfo(latitude, longitude);

    // Step 2: Generate prompt for Groq API
    const oneWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    const prompt = `Generate a summary of major crime-related news events concerning women from ${locationInfo.district}, ${locationInfo.state}, ${locationInfo.country} between ${oneWeekAgo} and ${today}. Focus on incidents of violence against women and harassment cases. Format the response as JSON with date-wise crime news items related to women.`;

;

    // Step 3: Call the Groq API to get news summary
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-groq-70b-8192-tool-use-preview', // Use the specified LLaMA model
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Step 4: Parse and send back response
    const newsData = JSON.parse(completion.choices[0].message.content);
    res.json({ location: locationInfo, news: newsData });
  } catch (error) {
    logger.error('Error fetching location news:', error);
    res.status(500).json({ error: 'Failed to fetch location news' });
  }
};

module.exports = { getLocationNews };
