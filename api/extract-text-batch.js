const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
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
      confidence: result.data.confidence
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
    const files = [];
    const batchId = uuidv4();

    return new Promise((resolve) => {
      bb.on('file', (fieldname, file, info) => {
        const chunks = [];
        
        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('end', () => {
          files.push({
            buffer: Buffer.concat(chunks),
            originalName: info.filename,
            mimeType: info.mimeType
          });
        });
      });

      bb.on('close', async () => {
        if (files.length === 0) {
          return res.status(400).json({ error: 'No files uploaded' });
        }

        const results = [];

        // Process files sequentially to avoid memory overload
        for (const file of files) {
          try {
            // Validate file type
            const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'];
            if (!allowedMimes.includes(file.mimeType)) {
              results.push({
                filename: file.originalName,
                success: false,
                error: 'Only image files are allowed'
              });
              continue;
            }

            const result = await extractTextFromBuffer(file.buffer);
            results.push({
              filename: file.originalName,
              success: true,
              text: result.text,
              confidence: result.confidence
            });
          } catch (error) {
            results.push({
              filename: file.originalName,
              success: false,
              error: error.message
            });
          }
        }

        res.json({
          success: true,
          batchId,
          data: results,
          summary: {
            total: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            processedAt: new Date().toISOString()
          }
        });
        resolve();
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
