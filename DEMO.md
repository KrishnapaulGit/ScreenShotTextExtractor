# 🎯 Quick Demo - Running All Examples

Your screenshot path: `C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png`

---

## ✅ Step 1: Make Sure Backend is Running

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
Server running on http://localhost:5000
```

---

## 🧪 Choose Your Demo Method

### **Option 1: CURL (Fastest) ⚡**

**Windows (PowerShell):**
```powershell
curl -X POST http://localhost:5000/api/extract-text `
  -F "image=@'C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png'"
```

**Or click the batch file:**
```bash
extract-screenshot.bat
```

---

### **Option 2: JavaScript/Node.js** 

**Run directly:**
```bash
node extract-screenshot.js
```

**Output Example:**
```
📤 Sending request to API...
🖼️  File: email.png
🌐 URL: http://localhost:5000/api/extract-text

✅ SUCCESS! Text Extracted from Screenshot:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is the text extracted from your email screenshot.
It preserves the formatting and line breaks.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Confidence: 92.34%
📁 Filename: email.png
⏰ Extracted At: 2024-01-15T10:30:45.123Z
📏 Text Length: 156 characters
```

---

### **Option 3: Java**

**Compile:**
```bash
javac ExtractScreenshotText.java
```

**Run:**
```bash
java ExtractScreenshotText
```

**Output Example:**
```
🚀 Starting text extraction from screenshot...

📤 Sending request to API...
🖼️  File: email.png
🌐 URL: http://localhost:5000/api/extract-text

📥 Response Code: 200
✅ SUCCESS! Text Extracted from Screenshot:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is the text extracted from your email screenshot.
It preserves the formatting and line breaks.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Confidence: 92.34%
📏 Text Length: 156 characters
```

---

### **Option 4: PowerShell**

**Run directly:**
```powershell
.\extract-screenshot.ps1
```

---

## 📊 API Response Format

All methods return the same JSON response:

```json
{
  "success": true,
  "data": {
    "text": "Extracted text from your email screenshot...",
    "confidence": 0.9234,
    "filename": "email.png",
    "extractedAt": "2024-01-15T10:30:45.123Z"
  }
}
```

---

## 🔧 Troubleshooting

### "Cannot connect to API"
```bash
# Make sure backend is running in server folder
cd server
npm run dev
```

### "File not found"
- Verify the screenshot path: `C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png`
- Make sure the file actually exists

### Port 5000 already in use
```powershell
# Kill the process using port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Then restart backend
npm run dev
```

---

## 📁 Files Included

| File | Usage |
|------|-------|
| `extract-screenshot.js` | Node.js script (recommended) |
| `extract-screenshot.bat` | Windows batch script |
| `extract-screenshot.ps1` | PowerShell script |
| `ExtractScreenshotText.java` | Java application |
| `examples-curl-js-java.md` | Detailed documentation |

---

## 🚀 Recommended Flow

1. **First Time:**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev
   ```

2. **Extract Text:**
   ```bash
   # Terminal 2: Run one of these
   
   # Quick test with cURL
   curl -X POST http://localhost:5000/api/extract-text -F "image=@'C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png'"
   
   # Or use Node.js
   node extract-screenshot.js
   
   # Or use Java
   javac ExtractScreenshotText.java && java ExtractScreenshotText
   
   # Or PowerShell
   .\extract-screenshot.ps1
   ```

---

## 💡 Next Steps

- Integrate this API into your own projects
- Use the extracted text in your applications
- Modify the screenshot path to extract from different images
- Batch process multiple images with the batch endpoint

---

**Happy extracting! 📸✨**
