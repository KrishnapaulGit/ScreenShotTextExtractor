const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function extractTextFromScreenshot() {
  try {
    // Path to your screenshot
    const imagePath = 'C:\\Users\\KRISHNA PAUL\\OneDrive\\Pictures\\Screenshots\\email.png';
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.error('❌ File not found:', imagePath);
      console.error('Please check the path and try again.');
      return;
    }

    // Create form data
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    // Send request to API
    console.log('📤 Sending request to API...');
    console.log('🖼️  File:', path.basename(imagePath));
    console.log('🌐 URL: http://localhost:5000/api/extract-text\n');

    const response = await axios.post(
      'http://localhost:5000/api/extract-text',
      form,
      { headers: form.getHeaders() }
    );

    // Process response
    const { success, data } = response.data;
    
    if (success) {
      console.log('✅ SUCCESS! Text Extracted from Screenshot:\n');
      console.log('━'.repeat(70));
      console.log(data.text);
      console.log('━'.repeat(70));
      console.log(`\n📊 Confidence: ${(data.confidence * 100).toFixed(2)}%`);
      console.log(`📁 Filename: ${data.filename}`);
      console.log(`⏰ Extracted At: ${data.extractedAt}`);
      console.log(`📏 Text Length: ${data.text.length} characters`);
    } else {
      console.error('❌ Extraction failed:', response.data.error);
    }

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Cannot connect to API!');
      console.error('Make sure backend is running: npm run dev (in server folder)');
    } else if (error.response) {
      console.error('❌ API Error:', error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the function
console.log('🚀 Starting text extraction from screenshot...\n');
extractTextFromScreenshot();

