const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-API-Key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key is required'
      });
    }

    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    const body =
      typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body;

    const { userId, email } = body || {};

    if (!userId || !email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'userId and email are required'
      });
    }

    const token = jwt.sign(
      {
        userId,
        email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '365d'
      }
    );

    return res.status(200).json({
      success: true,
      token,
      tokenType: 'Bearer',
      expiresIn: '365d',
      user: {
        userId,
        email
      }
    });
  } catch (error) {
    console.error('Token generation error:', error);

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};