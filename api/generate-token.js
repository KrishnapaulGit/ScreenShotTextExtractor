#!/usr/bin/env node

/**
 * Generate Bearer Token for Screenshot Text Extractor
 * 
 * This script generates a Bearer token for authenticating with the API.
 * Tokens generated with this setup are LIFETIME tokens (never expire).
 * 
 * Usage:
 *   node generate-token.js
 * 
 * Then follow the prompts to enter your details.
 */

const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const API_URL = 'http://localhost:5000';

/**
 * Make an HTTP request
 */
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * Prompt user for input
 */
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Bearer Token Generator (LIFETIME)         ║');
  console.log('║  Screenshot Text Extractor API             ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    // Get user input
    const apiKey = await prompt('Enter API Key: ');
    const userId = await prompt('Enter User ID (or press Enter for default): ') || 'default-user';
    const email = await prompt('Enter Email (or press Enter for default): ') || 'user@example.com';

    if (!apiKey.trim()) {
      console.log('\n❌ Error: API Key is required!\n');
      rl.close();
      return;
    }

    console.log('\n⏳ Generating token...\n');

    // Make request to generate token
    const payload = JSON.stringify({
      userId: userId.trim(),
      email: email.trim()
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/generate-token',
      method: 'POST',
      headers: {
        'X-API-Key': apiKey.trim(),
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const response = await makeRequest(options, payload);

    if (response.status === 200) {
      const data = JSON.parse(response.body);
      
      console.log('╔════════════════════════════════════════════╗');
      console.log('║  ✅ TOKEN GENERATED SUCCESSFULLY!         ║');
      console.log('╚════════════════════════════════════════════╝\n');

      console.log('📋 Token Details:\n');
      console.log(`User ID:     ${userId.trim()}`);
      console.log(`Email:       ${email.trim()}`);
      console.log(`Expires:     ${data.expiresIn}`);
      console.log(`Type:        LIFETIME (never expires)\n`);

      console.log('🔑 Your Bearer Token:\n');
      console.log('─'.repeat(80));
      console.log(data.token);
      console.log('─'.repeat(80));

      console.log('\n📌 How to use this token:\n');
      console.log('1️⃣  Copy the token above');
      console.log('2️⃣  Use in Frontend: Click "Generate Token" button and paste it');
      console.log('3️⃣  Use in cURL:');
      console.log(`    curl -X POST http://localhost:5000/api/extract-text \\`);
      console.log(`      -H "Authorization: Bearer ${data.token.substring(0, 20)}..." \\`);
      console.log(`      -F "image=@image.png"\n`);

      console.log('4️⃣  Use in JavaScript:');
      console.log(`    const headers = {`);
      console.log(`      'Authorization': 'Bearer ${data.token.substring(0, 20)}...'`);
      console.log(`    };\n`);

      console.log('⚠️  Security Notes:');
      console.log('   • This token has NO EXPIRATION - keep it secure!');
      console.log('   • Do not share or commit tokens to version control');
      console.log('   • Use environment variables to store tokens\n');

    } else {
      const errorData = JSON.parse(response.body);
      console.log('❌ Error generating token:\n');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${errorData.error}`);
      console.log(`Message: ${errorData.message}\n`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message, '\n');
  } finally {
    rl.close();
  }
}

// Run
main();
