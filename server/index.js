const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ocrController = require('./controllers/ocrController');
const { verifyToken, logAuthRequest } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
// Public endpoint to generate tokens
app.post('/api/generate-token', (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const expectedApiKey = process.env.API_KEY || 'your-api-key-for-token-generation';

    // Verify API key for security
    if (!apiKey || apiKey !== expectedApiKey) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid or missing API key'
      });
    }

    const payload = {
      userId: req.body.userId || 'default-user',
      email: req.body.email || 'user@example.com',
      iat: Math.floor(Date.now() / 1000)
    };

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const expiryTime = process.env.JWT_EXPIRY; // undefined = lifetime token

    const tokenOptions = {};
    // Only add expiresIn if JWT_EXPIRY is configured
    if (expiryTime) {
      tokenOptions.expiresIn = expiryTime;
    }

    const token = jwt.sign(payload, secret, tokenOptions);

    res.json({
      token,
      expiresIn: expiryTime || 'lifetime (never expires)',
      message: 'Bearer token generated successfully'
    });
  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({
      error: 'Token generation failed',
      details: err.message
    });
  }
});

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Screenshot Text Extractor API is running' });
});

// Public OCR endpoints - no authentication required (for website)
app.post('/api/extract-text', upload.single('image'), ocrController.extractText);
app.post('/api/extract-text-batch', upload.array('images', 10), ocrController.extractTextBatch);
app.post('/api/extract-text-base64', ocrController.extractTextFromBase64);

// Protected routes - require Bearer token (for external API users)
app.post('/api/extract-text-auth', verifyToken, logAuthRequest, upload.single('image'), ocrController.extractText);
app.post('/api/extract-text-batch-auth', verifyToken, logAuthRequest, upload.array('images', 10), ocrController.extractTextBatch);
app.post('/api/extract-text-base64-auth', verifyToken, logAuthRequest, ocrController.extractTextFromBase64);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds limit' });
    }
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
});

module.exports = app;
