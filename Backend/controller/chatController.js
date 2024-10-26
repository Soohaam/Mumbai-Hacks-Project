const express = require('express');
const axios = require('axios');
const moment = require('moment');

// Utility to get location information
const getLocationInfo = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'WomenSafetyChatbot/1.0',
        },
      }
    );
    const address = response.data.address;
    return {
      district: address.state_district,
      state: address.state,
      country: address.country,
    };
  } catch (error) {
    console.error('Error getting location info:', error);
    throw error;
  }
};

// Simple intent detection
const detectIntent = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Emergency keywords
  if (lowercaseMessage.includes('help') || 
      lowercaseMessage.includes('emergency') || 
      lowercaseMessage.includes('danger') ||
      lowercaseMessage.includes('unsafe') ||
      lowercaseMessage.includes('following') ||
      lowercaseMessage.includes('harass')) {
    return 'EMERGENCY_GUIDANCE';
  }
  
  // Safety information keywords
  if (lowercaseMessage.includes('safe') || 
      lowercaseMessage.includes('area') || 
      lowercaseMessage.includes('location') ||
      lowercaseMessage.includes('route') ||
      lowercaseMessage.includes('night')) {
    return 'SAFETY_INFO';
  }
  
  // Local resources keywords
  if (lowercaseMessage.includes('police') || 
      lowercaseMessage.includes('hospital') || 
      lowercaseMessage.includes('helpline') ||
      lowercaseMessage.includes('number') ||
      lowercaseMessage.includes('contact')) {
    return 'LOCAL_RESOURCES';
  }
  
  return 'GENERAL_ADVICE';
};

// Response templates
const responseTemplates = {
  EMERGENCY_GUIDANCE: {
    response: "Your safety is our top priority. Here are immediate steps you can take:",
    safetyTips: [
      "Stay in a well-lit, populated area if possible",
      "Call emergency services immediately (Dial 100 for Police)",
      "Share your live location with trusted contacts",
      "Try to move to the nearest safe establishment (police station, hospital, or open shop)",
      "Make noise and draw attention if you feel threatened"
    ],
    localResources: {
      emergencyNumbers: [
        "Police: 100",
        "Women's Helpline: 1091",
        "Emergency Service: 112"
      ],
      safetyServices: [
        "Nearest Police Station",
        "24/7 Women's Helpdesk",
        "Emergency Response Team"
      ]
    },
    immediateActions: [
      "Call emergency services",
      "Share location with trusted contacts",
      "Move to a safe location",
      "Stay on call with someone"
    ]
  },
  
  SAFETY_INFO: {
    response: "Here's what you should know about safety in this area:",
    safetyTips: [
      "Stick to well-lit main roads",
      "Avoid isolated areas, especially after dark",
      "Keep emergency numbers saved",
      "Use verified transportation services",
      "Stay aware of your surroundings"
    ],
    localResources: {
      emergencyNumbers: [
        "Police: 100",
        "Women's Helpline: 1091"
      ],
      safetyServices: [
        "Local Police Patrol",
        "Women's Safety Apps",
        "Safe Zone Areas"
      ]
    },
    immediateActions: [
      "Plan your route in advance",
      "Share your expected arrival time with someone",
      "Keep your phone charged"
    ]
  },
  
  LOCAL_RESOURCES: {
    response: "Here are the important local resources and contacts:",
    safetyTips: [
      "Save these numbers on speed dial",
      "Keep physical copies of important numbers",
      "Know the locations of nearby safe zones"
    ],
    localResources: {
      emergencyNumbers: [
        "Police: 100",
        "Women's Helpline: 1091",
        "Ambulance: 102",
        "Emergency Service: 112"
      ],
      safetyServices: [
        "Local Police Station",
        "Women's Help Desk",
        "Safe Transit Services",
        "24/7 Emergency Response"
      ]
    },
    immediateActions: [
      "Verify and save all emergency numbers",
      "Identify nearest emergency services",
      "Download recommended safety apps"
    ]
  },
  
  GENERAL_ADVICE: {
    response: "Here are some general safety tips to keep in mind:",
    safetyTips: [
      "Always keep emergency numbers handy",
      "Stay aware of your surroundings",
      "Plan your travel routes in advance",
      "Keep your phone charged",
      "Trust your instincts"
    ],
    localResources: {
      emergencyNumbers: [
        "Universal Emergency: 112",
        "Women's Helpline: 1091"
      ],
      safetyServices: [
        "Local Safety Resources",
        "Emergency Services",
        "Women's Support Groups"
      ]
    },
    immediateActions: [
      "Review safety guidelines",
      "Check local safety resources",
      "Plan ahead for safety"
    ]
  }
};

// Main chatbot handler
const chatbotHandler = async (req, res) => {
  const { message, latitude, longitude } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Get location information
    const locationInfo = await getLocationInfo(latitude, longitude);
    
    // Detect intent from message
    const messageType = detectIntent(message);
    
    // Get appropriate response template
    const responseTemplate = responseTemplates[messageType];
    
    // Customize response with location info
    const response = {
      messageType,
      ...responseTemplate,
      location: locationInfo,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      fallbackResponse: 'If this is an emergency, please dial 100 for immediate police assistance.'
    });
  }
};

module.exports = {chatbotHandler};
