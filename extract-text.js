const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const { writeFile, unlink } = require('fs').promises;
const path = require('path');
const os = require('os');
const busboy = require('busboy');

/**
 * Preprocess image for better OCR accuracy
 */
async function preprocessImage(buffer) {
  try {
    return await sharp(buffer)
      .grayscale()
      .normalize()
      .sharpen()
      .toBuffer();
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return buffer;
  }
}

/**
 * Extract text from image buffer
 */
async function extractTextFromBuffer(buffer) {
  try {
    const processedBuffer = await preprocessImage(buffer);
    
    const result = await Tesseract.recognize(
      processedBuffer,
      'eng',
      {
        logger: m => console.log('OCR Progress:', m.progress)
      }
    );
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      blocks: result.data.blocks
    };
  } catch (error) {
    throw new Error(`OCR extraction failed: ${error.message}`);
  }
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const bb = busboy({ headers: req.headers });
    let fileBuffer = null;
    let originalName = '';

    return new Promise((resolve) => {
      bb.on('file', (fieldname, file, info) => {
        const chunks = [];
        
        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('end', async () => {
          fileBuffer = Buffer.concat(chunks);
          originalName = info.filename;

          // Validate file type
          const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
          if (!allowedMimes.includes(info.mimeType)) {
            return res.status(400).json({ error: 'Only image files are allowed' });
          }

          try {
            const result = await extractTextFromBuffer(fileBuffer);

            res.json({
              success: true,
              data: {
                text: result.text,
                confidence: result.confidence,
                filename: originalName,
                extractedAt: new Date().toISOString()
              }
            });
            resolve();
          } catch (error) {
            res.status(500).json({
              success: false,
              error: error.message
            });
            resolve();
          }
        });
      });

      bb.on('error', (error) => {
        res.status(400).json({ error: 'Failed to parse upload' });
        resolve();
      });

      req.pipe(bb);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
