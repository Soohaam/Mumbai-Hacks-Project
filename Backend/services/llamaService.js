// llamaService.js
const axios = require('axios');
const logger = require('../utils/logger');
const moment = require('moment');

class LlamaService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.LLAMA_API_URL || 'https://api.llama.your-provider.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: process.env.NODE_ENV === 'production',
        timeout: 30000
      })
    });
  }

  static getInstance() {
    if (!LlamaService.instance) {
      LlamaService.instance = new LlamaService();
    }
    return LlamaService.instance;
  }

  async getLocationNews(locationInfo) {
    try {
      const oneWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
      const today = moment().format('YYYY-MM-DD');

      const prompt = `Generate a summary of major news events and developments from ${locationInfo.district}, ${locationInfo.state}, ${locationInfo.country} between ${oneWeekAgo} and ${today}. Focus on local developments, infrastructure projects, community events, and significant incidents. Format the response as JSON with date-wise news items.`;

      const response = await this.axiosInstance.post('/chat/completions', {
        model: "llama-2-70b-chat",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1000
      });

      return this.parseNewsResponse(response.data.choices[0].message.content);
    } catch (error) {
      logger.error('LLAMA API error:', error);
      throw new Error('Failed to fetch news from LLAMA');
    }
  }

  parseNewsResponse(content) {
    try {
      const newsData = JSON.parse(content);
      return this.validateAndFormatNews(newsData);
    } catch (error) {
      logger.error('News parsing error:', error);
      throw new Error('Failed to parse news data');
    }
  }

  validateAndFormatNews(newsData) {
    const formattedNews = {
      timestamp: new Date().toISOString(),
      news_items: []
    };

    for (const date in newsData) {
      if (Array.isArray(newsData[date])) {
        newsData[date].forEach(item => {
          formattedNews.news_items.push({
            date,
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'general'
          });
        });
      }
    }

    return formattedNews;
  }
}

module.exports = LlamaService;

