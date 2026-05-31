#!/usr/bin/env node

/**
 * Generate Bearer Token for Distribution
 * 
 * This script generates a LIFETIME bearer token that you can:
 * 1. Create once and share with others
 * 2. Use in any API request (curl, Java, Python, Node.js, etc.)
 * 3. Store in environment variables or config files
 * 
 * Usage:
 *   node create-api-token.js
 */

const http = require('http');

const API_URL = 'http://localhost:5000';
const API_KEY = 'krishna.screenshot.api.key.2026';

/**
 * Make HTTP request
 */
function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
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
 * Generate token
 */
async function generateToken() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Create Shareable Bearer Token             ║');
  console.log('║  (LIFETIME - Never Expires)                ║');
  console.log('╚════════════════════════════════════════════╝\n');

  try {
    const payload = JSON.stringify({
      userId: 'api-user',
      email: 'api@example.com'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/generate-token',
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const response = await makeRequest(options, payload);

    if (response.status === 200) {
      const data = JSON.parse(response.body);
      const token = data.token;

      console.log('✅ TOKEN GENERATED SUCCESSFULLY!\n');
      console.log('═'.repeat(80));
      console.log('BEARER TOKEN (LIFETIME):');
      console.log('═'.repeat(80));
      console.log(token);
      console.log('═'.repeat(80));

      console.log('\n📋 HOW TO USE THIS TOKEN:\n');

      console.log('1️⃣  CURL - Single Image:');
      console.log('─'.repeat(80));
      console.log(`curl -X POST http://localhost:5000/api/extract-text \\`);
      console.log(`  -H "Authorization: Bearer ${token}" \\`);
      console.log(`  -F "image=@image.png"`);
      console.log();

      console.log('2️⃣  CURL - Batch Upload:');
      console.log('─'.repeat(80));
      console.log(`curl -X POST http://localhost:5000/api/extract-text-batch \\`);
      console.log(`  -H "Authorization: Bearer ${token}" \\`);
      console.log(`  -F "images=@image1.png" \\`);
      console.log(`  -F "images=@image2.png"`);
      console.log();

      console.log('3️⃣  JAVASCRIPT / NODE.JS:');
      console.log('─'.repeat(80));
      console.log(`const token = '${token}';`);
      console.log(`const headers = {`);
      console.log(`  'Authorization': \`Bearer \${token}\`,`);
      console.log(`  'Content-Type': 'multipart/form-data'`);
      console.log(`};`);
      console.log();

      console.log('4️⃣  PYTHON:');
      console.log('─'.repeat(80));
      console.log(`token = '${token}'`);
      console.log(`headers = {'Authorization': f'Bearer {token}'}`);
      console.log(`response = requests.post('http://localhost:5000/api/extract-text',`);
      console.log(`  headers=headers,`);
      console.log(`  files={'image': open('image.png', 'rb')}`);
      console.log(`)`);
      console.log();

      console.log('5️⃣  JAVA:');
      console.log('─'.repeat(80));
      console.log(`String token = "${token}";`);
      console.log(`String authHeader = "Bearer " + token;`);
      console.log(`// Add to request headers`);
      console.log(`conn.setRequestProperty("Authorization", authHeader);`);
      console.log();

      console.log('6️⃣  ENVIRONMENT VARIABLE:');
      console.log('─'.repeat(80));
      console.log(`# Save in .env or config file:`);
      console.log(`API_TOKEN=${token}`);
      console.log();

      console.log('📌 SHARING THIS TOKEN:\n');
      console.log('✅ DO:');
      console.log('   • Share via secure channels (encrypted email, password managers)');
      console.log('   • Store in .env files (NOT in git)');
      console.log('   • Use in environment variables');
      console.log();
      console.log('❌ DON\'T:');
      console.log('   • Share via plain text/chat');
      console.log('   • Commit to version control');
      console.log('   • Expose in logs or error messages\n');

      console.log('⏰ TOKEN CHARACTERISTICS:');
      console.log('   • Type: LIFETIME (♾️ Never expires)');
      console.log('   • Generated: ' + new Date().toISOString());
      console.log('   • Revocation: Only by changing JWT_SECRET on server\n');

    } else {
      console.log('❌ Error generating token');
      console.log(response.body);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateToken();
