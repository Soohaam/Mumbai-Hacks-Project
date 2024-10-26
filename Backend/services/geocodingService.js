const axios = require('axios');
const logger = require('../utils/logger');

class GeocodingService {
  static async getLocationInfo(latitude, longitude) {
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
      
      return {
        district: address.county || address.city_district || address.district || address.state_district,
        state: address.state,
        country: address.country,
        city: address.city || address.town || address.village,
        formatted_address: response.data.display_name
      };
    } catch (error) {
      logger.error('Geocoding error:', error);
      throw new Error('Failed to get location information');
    }
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async getLocationInfoWithRateLimit(latitude, longitude) {
    await this.sleep(1000);
    return this.getLocationInfo(latitude, longitude);
  }
}

module.exports = GeocodingService;
