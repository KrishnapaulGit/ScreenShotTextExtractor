# Screenshot Text Extractor - Getting Started Guide

## 🎉 Project Setup Complete!

Your full-stack OCR application is ready to run. This guide will help you get started in just a few minutes.

## ⚡ Quick Start (5 minutes)

### Step 1: Start the Backend API

Open a terminal in VS Code and run:

```bash
cd server
npm run dev
```

You should see:
```
Server running on http://localhost:5000
Upload directory: ./uploads
```

### Step 2: Start the Frontend (New Terminal)

Open a new terminal and run:

```bash
cd client
npm start
```

The React app will open automatically at `http://localhost:3000`

## 🚀 That's it! Your app is running!

You can now:
- 📸 Upload a screenshot and extract text
- 📦 Batch upload up to 10 images
- 📋 Copy extracted text to clipboard
- ⬇️ Download results as text files

---

## 📚 Project Features

### Backend API (Port 5000)
- **POST /api/extract-text** - Single image OCR
- **POST /api/extract-text-batch** - Batch processing (up to 10 images)
- **POST /api/extract-text-base64** - Base64 encoded image OCR
- **GET /api/health** - API health check

### Frontend (Port 3000)
- ✨ Single Image Mode - Extract text from one image at a time
- 📦 Batch Mode - Process multiple images together
- 🎨 Beautiful UI with animations
- 📱 Fully responsive design
- ⚡ Real-time processing with visual feedback

### Technical Stack
- **Backend**: Node.js + Express + Tesseract.js
- **Frontend**: React 18 + Axios
- **Image Processing**: Sharp (automatic preprocessing)
- **OCR Engine**: Tesseract.js (runs locally)

---

## 🔧 Configuration

### Backend Environment Variables

Edit `server/.env` (copy from `.env.example`):

```env
PORT=5000                          # API port
NODE_ENV=development               # Environment
MAX_FILE_SIZE=10485760            # Max upload size (10MB)
UPLOAD_DIR=./uploads              # Uploads directory
```

### Frontend Configuration

Edit `client/package.json` proxy (already set):
```json
"proxy": "http://localhost:5000"
```

---

## 📖 API Usage Examples

### Extract Text from Single Image

```bash
curl -X POST http://localhost:5000/api/extract-text \
  -F "image=@screenshot.png"
```

Response:
```json
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "confidence": 0.95,
    "filename": "screenshot.png",
    "extractedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Batch Extract Text

```bash
curl -X POST http://localhost:5000/api/extract-text-batch \
  -F "images=@image1.png" \
  -F "images=@image2.png" \
  -F "images=@image3.png"
```

### Extract from Base64 Image

```bash
curl -X POST http://localhost:5000/api/extract-text-base64 \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/png;base64,...",
    "filename": "screenshot.png"
  }'
```

---

## 🎯 Usage Tips

### For Best OCR Results:
1. **High Resolution** - Use images with clear, readable text
2. **Good Contrast** - Ensure text stands out from background
3. **Proper Orientation** - Make sure text isn't rotated
4. **Clean Images** - Avoid blurry or compressed screenshots
5. **Reasonable Size** - Don't exceed 10MB per file

### Keyboard Shortcuts:
- In Single Mode: Press Enter after selecting image to extract
- In Batch Mode: Select multiple files at once with Ctrl+Click

---

## 🐛 Troubleshooting

### "Cannot find module" errors?
```bash
# Reinstall dependencies
npm install
```

### API won't start?
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Change port in server/.env
PORT=5001
```

### Frontend won't connect to backend?
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check proxy in client/package.json
# Should be: "proxy": "http://localhost:5000"
```

### Out of memory during batch processing?
- Reduce batch size from 10 to 5
- Restart Node.js server after processing large batches

---

## 📁 Project Structure

```
ScreenShotTextExtractor/
├── server/
│   ├── controllers/
│   │   └── ocrController.js      # OCR logic
│   ├── uploads/                  # Processed images
│   ├── index.js                  # Express server
│   ├── package.json
│   └── .env                      # Configuration
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SingleExtractor.js
│   │   │   └── BatchExtractor.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
└── README.md
```

---

## 🚀 Next Steps

### To Deploy:

**Frontend (Netlify/Vercel):**
```bash
cd client
npm run build
# Deploy the 'build' folder
```

**Backend (Heroku/Railway):**
```bash
# Add Procfile to root:
echo "web: node server/index.js" > Procfile

# Deploy with Git
git push heroku main
```

### To Add Features:

1. **New API Endpoint**: Edit `server/index.js`
2. **OCR Logic**: Edit `server/controllers/ocrController.js`
3. **UI Component**: Create in `client/src/components/`
4. **Styling**: Add corresponding `.css` file

---

## 💡 Popular Enhancements

- 🌍 Multi-language OCR support
- 🔒 User authentication & cloud storage
- 📊 Text statistics & analysis
- 🎨 Image preprocessing UI controls
- 📱 Mobile app version (React Native)
- ⚙️ WebSocket real-time processing
- 🔐 Encrypted file storage

---

## 📞 Support

For issues or questions:
1. Check the [README.md](./README.md) for detailed documentation
2. Review logs in browser DevTools (F12)
3. Check terminal output for backend errors
4. Verify all ports are available and not blocked

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tesseract.js Guide](https://github.com/naptha/tesseract.js)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)

---

**Happy extracting! 📸✨**

Need to restart? Just run the same commands in new terminals. Both services will continue running until you stop them (Ctrl+C).
