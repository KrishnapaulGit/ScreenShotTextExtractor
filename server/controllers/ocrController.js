const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Preprocess image for better OCR accuracy
 */
async function preprocessImage(imagePath) {
  try {
    const processedPath = path.join(path.dirname(imagePath), `processed-${Date.now()}.jpg`);
    
    await sharp(imagePath)
      .grayscale() // Convert to grayscale
      .normalize() // Normalize contrast
      .sharpen() // Enhance sharpness
      .toFile(processedPath);
    
    return processedPath;
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return imagePath; // Fallback to original if preprocessing fails
  }
}

/**
 * Extract text from a single image
 */
async function extractTextFromImage(imagePath) {
  try {
    // Preprocess image for better OCR
    const processedPath = await preprocessImage(imagePath);
    
    const result = await Tesseract.recognize(
      processedPath,
      'eng',
      {
        logger: m => console.log('OCR Progress:', m.progress)
      }
    );
    
    // Clean up processed image
    try {
      await fs.unlink(processedPath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return {
      text: result.data.text,
      confidence: result.data.confidence,
      blocks: result.data.blocks
    };
  } catch (error) {
    throw new Error(`OCR extraction failed: ${error.message}`);
  }
}

/**
 * Extract text from uploaded file
 */
exports.extractText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await extractTextFromImage(req.file.path);
    
    // Clean up uploaded file
    try {
      await fs.unlink(req.file.path);
    } catch (e) {
      // Ignore cleanup errors
    }

    res.json({
      success: true,
      data: {
        text: result.text,
        confidence: result.confidence,
        filename: req.file.originalname,
        extractedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    // Clean up file if error occurs
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Extract text from multiple images (batch processing)
 */
exports.extractTextBatch = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const batchId = uuidv4();
    const results = [];

    // Process files sequentially to avoid memory overload
    for (const file of req.files) {
      try {
        const result = await extractTextFromImage(file.path);
        results.push({
          filename: file.originalname,
          success: true,
          text: result.text,
          confidence: result.confidence
        });
      } catch (error) {
        results.push({
          filename: file.originalname,
          success: false,
          error: error.message
        });
      } finally {
        // Clean up file
        try {
          await fs.unlink(file.path);
        } catch (e) {
          // Ignore cleanup errors
        }
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
  } catch (error) {
    // Clean up files
    if (req.files) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Extract text from base64 encoded image
 */
exports.extractTextFromBase64 = async (req, res) => {
  let tempFilePath = null;
  
  try {
    const { image, filename = 'image.png' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Decode base64 and save to temp file
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    tempFilePath = path.join(process.env.UPLOAD_DIR || './uploads', `temp-${Date.now()}.png`);
    await fs.writeFile(tempFilePath, buffer);

    const result = await extractTextFromImage(tempFilePath);

    res.json({
      success: true,
      data: {
        text: result.text,
        confidence: result.confidence,
        filename,
        extractedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    // Clean up temp file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
};
