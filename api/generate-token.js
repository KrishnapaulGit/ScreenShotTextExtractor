const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-API-Key'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    // Validate API Key
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

    // Read request body
    let body = req.body;

    if (!body) {
      let rawBody = '';

      for await (const chunk of req) {
        rawBody += chunk;
      }

      if (!rawBody) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Request body is missing'
        });
      }

      try {
        body = JSON.parse(rawBody);
      } catch (err) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid JSON payload'
        });
      }
    }

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid JSON payload'
        });
      }
    }

    const { userId, email } = body;

    if (!userId || !email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'userId and email are required'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: 'Server Configuration Error',
        message: 'JWT_SECRET is not configured'
      });
    }

    const token = jwt.sign(
      {
        userId,
        email,
        createdAt: new Date().toISOString()
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