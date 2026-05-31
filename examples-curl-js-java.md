# API Usage Examples with Real Screenshot

**Screenshot Path:** `C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png`

**API Base URL:** `http://localhost:5000`

---

## 1️⃣ CURL Command

### Single Image Extraction

```bash
curl -X POST http://localhost:5000/api/extract-text ^
  -F "image=@C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png"
```

**On Linux/Mac (use `\` instead of `^`):**
```bash
curl -X POST http://localhost:5000/api/extract-text \
  -F "image=@~/Pictures/Screenshots/email.png"
```

### Response:
```json
{
  "success": true,
  "data": {
    "text": "[Extracted email text from screenshot]",
    "confidence": 0.92,
    "filename": "email.png",
    "extractedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2️⃣ JavaScript/Node.js Code

### Method 1: Using Axios with File System

**File:** `extract-with-axios.js`

```javascript
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
      return;
    }

    // Create form data
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    // Send request to API
    console.log('📤 Sending request to API...');
    const response = await axios.post(
      'http://localhost:5000/api/extract-text',
      form,
      { headers: form.getHeaders() }
    );

    // Process response
    const { success, data } = response.data;
    
    if (success) {
      console.log('\n✅ SUCCESS! Text Extracted:\n');
      console.log('━'.repeat(60));
      console.log(data.text);
      console.log('━'.repeat(60));
      console.log(`\n📊 Confidence: ${(data.confidence * 100).toFixed(2)}%`);
      console.log(`📁 Filename: ${data.filename}`);
      console.log(`⏰ Extracted At: ${data.extractedAt}`);
    } else {
      console.error('❌ Extraction failed:', response.data.error);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run the function
extractTextFromScreenshot();
```

**Run it:**
```bash
node extract-with-axios.js
```

---

### Method 2: Using Fetch API (Browser/Node 18+)

**File:** `extract-with-fetch.js`

```javascript
async function extractTextFromScreenshot() {
  try {
    // Get file input or use file path
    const imagePath = 'C:\\Users\\KRISHNA PAUL\\OneDrive\\Pictures\\Screenshots\\email.png';
    
    // Read file and create blob
    const response = await fetch(`file://${imagePath}`);
    const blob = await response.blob();

    // Create FormData
    const formData = new FormData();
    formData.append('image', blob, 'email.png');

    // Send to API
    console.log('📤 Sending request to API...');
    const apiResponse = await fetch('http://localhost:5000/api/extract-text', {
      method: 'POST',
      body: formData
    });

    const result = await apiResponse.json();

    if (result.success) {
      console.log('\n✅ SUCCESS! Text Extracted:\n');
      console.log('━'.repeat(60));
      console.log(result.data.text);
      console.log('━'.repeat(60));
      console.log(`\n📊 Confidence: ${(result.data.confidence * 100).toFixed(2)}%`);
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

extractTextFromScreenshot();
```

---

### Method 3: Browser Frontend Code

**File:** `extract-browser.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Extract Text from Screenshot</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
    h1 { color: #333; margin-bottom: 20px; }
    .input-group { margin-bottom: 20px; }
    input, button { padding: 10px; font-size: 16px; width: 100%; }
    button { background: #667eea; color: white; border: none; cursor: pointer; border-radius: 5px; }
    button:hover { background: #764ba2; }
    #result { margin-top: 20px; background: #f0f1ff; padding: 15px; border-radius: 5px; display: none; }
    #resultText { white-space: pre-wrap; margin: 10px 0; }
    .loading { color: #999; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Screenshot Text Extractor</h1>
    
    <div class="input-group">
      <input type="file" id="imageInput" accept="image/*" placeholder="Select screenshot...">
    </div>
    
    <button onclick="extractText()">🚀 Extract Text</button>
    
    <div id="result">
      <h2>✅ Extracted Text:</h2>
      <div id="resultText"></div>
      <div id="confidence"></div>
    </div>
    
    <div id="loading" class="loading" style="display: none;">
      Processing... Please wait
    </div>
  </div>

  <script>
    async function extractText() {
      const fileInput = document.getElementById('imageInput');
      const resultDiv = document.getElementById('result');
      const loadingDiv = document.getElementById('loading');
      
      if (!fileInput.files.length) {
        alert('Please select an image first');
        return;
      }

      const formData = new FormData();
      formData.append('image', fileInput.files[0]);

      loadingDiv.style.display = 'block';
      resultDiv.style.display = 'none';

      try {
        const response = await fetch('http://localhost:5000/api/extract-text', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          document.getElementById('resultText').textContent = data.data.text;
          document.getElementById('confidence').textContent = 
            `Confidence: ${(data.data.confidence * 100).toFixed(2)}%`;
          resultDiv.style.display = 'block';
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        alert('Error: ' + error.message);
      } finally {
        loadingDiv.style.display = 'none';
      }
    }
  </script>
</body>
</html>
```

**Usage:** Open in browser and select your screenshot

---

## 3️⃣ Java Code

### Method 1: Using HttpURLConnection

**File:** `ExtractTextFromScreenshot.java`

```java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.json.JSONObject;

public class ExtractTextFromScreenshot {
    
    public static void main(String[] args) {
        String imagePath = "C:\\Users\\KRISHNA PAUL\\OneDrive\\Pictures\\Screenshots\\email.png";
        extractText(imagePath);
    }
    
    static void extractText(String imagePath) {
        try {
            // Verify file exists
            File imageFile = new File(imagePath);
            if (!imageFile.exists()) {
                System.out.println("❌ File not found: " + imagePath);
                return;
            }

            // Create URL connection
            URL url = new URL("http://localhost:5000/api/extract-text");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            
            // Set up multipart form data
            String boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            connection.setDoOutput(true);
            connection.setDoInput(true);

            // Write request body
            try (OutputStream os = connection.getOutputStream()) {
                writeImageToRequest(os, imagePath, boundary);
            }

            // Read response
            int responseCode = connection.getResponseCode();
            System.out.println("📤 Response Code: " + responseCode);

            if (responseCode == HttpURLConnection.HTTP_OK) {
                String response = readResponse(connection.getInputStream());
                parseAndPrintResponse(response);
            } else {
                String error = readResponse(connection.getErrorStream());
                System.out.println("❌ Error: " + error);
            }

            connection.disconnect();
            
        } catch (Exception e) {
            System.out.println("❌ Exception: " + e.getMessage());
            e.printStackTrace();
        }
    }

    static void writeImageToRequest(OutputStream os, String imagePath, String boundary) throws IOException {
        String CRLF = "\r\n";
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, "UTF-8"), true);

        // Write file
        writer.append("--").append(boundary).append(CRLF);
        writer.append("Content-Disposition: form-data; name=\"image\"; filename=\"")
              .append(new File(imagePath).getName()).append("\"").append(CRLF);
        writer.append("Content-Type: image/png").append(CRLF);
        writer.append(CRLF);
        writer.flush();

        // Write file content
        Files.copy(Paths.get(imagePath), os);
        os.flush();

        // Write end boundary
        writer.append(CRLF).append("--").append(boundary).append("--").append(CRLF);
        writer.flush();
    }

    static String readResponse(InputStream is) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line);
        }
        return response.toString();
    }

    static void parseAndPrintResponse(String jsonResponse) {
        try {
            JSONObject json = new JSONObject(jsonResponse);
            
            if (json.getBoolean("success")) {
                JSONObject data = json.getJSONObject("data");
                String text = data.getString("text");
                double confidence = data.getDouble("confidence");
                
                System.out.println("\n✅ SUCCESS! Text Extracted:\n");
                System.out.println("━".repeat(60));
                System.out.println(text);
                System.out.println("━".repeat(60));
                System.out.println("\n📊 Confidence: " + String.format("%.2f%%", confidence * 100));
            } else {
                System.out.println("❌ Extraction failed");
            }
        } catch (Exception e) {
            System.out.println("❌ Error parsing response: " + e.getMessage());
        }
    }
}
```

**Compile & Run:**
```bash
# Install org.json library first
javac -cp "path/to/json-20230227.jar" ExtractTextFromScreenshot.java
java -cp "path/to/json-20230227.jar:." ExtractTextFromScreenshot
```

---

### Method 2: Using OkHttp (Simpler)

**File:** `ExtractTextOkHttp.java`

```java
import okhttp3.*;
import java.io.File;
import java.io.IOException;

public class ExtractTextOkHttp {
    
    public static void main(String[] args) throws IOException {
        String imagePath = "C:\\Users\\KRISHNA PAUL\\OneDrive\\Pictures\\Screenshots\\email.png";
        extractText(imagePath);
    }

    static void extractText(String imagePath) throws IOException {
        File file = new File(imagePath);
        
        if (!file.exists()) {
            System.out.println("❌ File not found: " + imagePath);
            return;
        }

        OkHttpClient client = new OkHttpClient();

        // Create request with multipart form data
        RequestBody requestBody = new MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("image", file.getName(),
                RequestBody.create(file, MediaType.parse("image/png")))
            .build();

        Request request = new Request.Builder()
            .url("http://localhost:5000/api/extract-text")
            .post(requestBody)
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String responseBody = response.body().string();
                System.out.println("✅ Response:\n" + responseBody);
            } else {
                System.out.println("❌ Error: " + response.code());
            }
        }
    }
}
```

**Add to pom.xml:**
```xml
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>4.11.0</version>
</dependency>
```

---

## 🧪 Quick Test Commands

### Windows PowerShell
```powershell
# Test API health
Invoke-WebRequest http://localhost:5000/api/health | ConvertTo-Json

# Extract text (requires curl installed)
curl -X POST http://localhost:5000/api/extract-text `
  -F "image=@'C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png'"
```

### Linux/Mac Bash
```bash
# Extract text
curl -X POST http://localhost:5000/api/extract-text \
  -F "image=@$HOME/Pictures/Screenshots/email.png"
```

---

## 📊 Expected Response Format

```json
{
  "success": true,
  "data": {
    "text": "This is the extracted text from your email screenshot...\nEach line will be preserved\nWith proper formatting",
    "confidence": 0.9234,
    "filename": "email.png",
    "extractedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

## ✅ All Methods Summary

| Method | Language | Best For |
|--------|----------|----------|
| cURL | Shell | Quick testing, automation |
| Axios | JavaScript | Node.js scripts |
| Fetch | JavaScript | Browser apps |
| HttpURLConnection | Java | Enterprise apps |
| OkHttp | Java | Better performance |

Choose the one that fits your project best! 🚀
