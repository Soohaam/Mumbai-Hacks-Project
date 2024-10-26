const GeocodingService = require('../services/geocodingService');
const LlamaService = require('../services/llamaService');
const logger = require('../utils/logger');

class NewsController {
  static async getLocationNews(req, res) {
    try {
      const { latitude, longitude } = req.query;

      if (!latitude || longitude === undefined) {
        return res.status(400).json({
          status: 'error',
          message: 'Latitude and longitude are required'
        });
      }

      // Validate coordinates
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid coordinates format'
        });
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({
          status: 'error',
          message: 'Coordinates out of valid range'
        });
      }

      // Get location information
      const locationInfo = await GeocodingService.getLocationInfo(latitude, longitude);

      // Fetch news using LLAMA
      const news = await LlamaService.getLocationNews(locationInfo);

      res.json({
        status: 'success',
        data: {
          location: locationInfo,
          news: news
        }
      });
    } catch (error) {
      logger.error('News controller error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to fetch news'
      });
    }
  }
}


module.exports = NewsController;


