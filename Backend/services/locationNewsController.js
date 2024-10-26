// locationNewsController.js
const GeocodingService = require('./geocodingService');
const LlamaService = require('./llamaService');
const logger = require('../utils/logger');

class LocationNewsController {
  constructor() {
    this.llamaService = LlamaService.getInstance();
  }

  async getNewsForCoordinates(latitude, longitude) {
    try {
      // Get location information
      const locationInfo = await GeocodingService.getLocationInfoWithRateLimit(latitude, longitude);
      
      // Get news for the location
      const news = await this.llamaService.getLocationNews(locationInfo);
      
      return {
        location: locationInfo,
        news: news
      };
    } catch (error) {
      logger.error('Location news error:', error);
      throw new Error('Failed to get location news');
    }
  }
}

module.exports = LocationNewsController;