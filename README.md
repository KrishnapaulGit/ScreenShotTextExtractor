# Screenshot Text Extractor

A full-stack web application that extracts text from screenshots and images using OCR technology. Built with Node.js/Express backend and React frontend.

## Features

✨ **Single Image Extraction** - Extract text from individual images with preview
📦 **Batch Processing** - Process up to 10 images at once
🔧 **Image Preprocessing** - Automatic image enhancement for better OCR accuracy
📋 **Text Formatting** - Preserves text layout and formatting from images
💾 **Export Options** - Copy extracted text or download as .txt file
🎨 **Responsive Design** - Works seamlessly on desktop and mobile devices
⚡ **Fast Processing** - Efficient OCR using Tesseract.js

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Tesseract.js** - OCR engine (client-side in browser, server-side support)
- **Sharp** - Image processing and preprocessing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **CSS3** - Styling with animations

## Project Structure

```
ScreenShotTextExtractor/
├── server/                 # Backend API
│   ├── controllers/
│   │   └── ocrController.js
│   ├── uploads/           # Uploaded images directory
│   ├── index.js          # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── client/               # Frontend React app
    ├── src/
    │   ├── components/
    │   │   ├── SingleExtractor.js
    │   │   ├── SingleExtractor.css
    │   │   ├── BatchExtractor.js
    │   │   └── BatchExtractor.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

4. Start the server:
```bash
npm run dev    # Development with auto-reload
npm start      # Production mode
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## API Endpoints

### Extract Text from Single Image
```
POST /api/extract-text
Content-Type: multipart/form-data

Request:
- image: File (image to process)

Response:
{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "confidence": 0.95,
    "filename": "image.png",
    "extractedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Batch Extract Text
```
POST /api/extract-text-batch
Content-Type: multipart/form-data

Request:
- images: File[] (up to 10 images)

Response:
{
  "success": true,
  "batchId": "uuid",
  "data": [
    {
      "filename": "image1.png",
      "success": true,
      "text": "Extracted text...",
      "confidence": 0.95
    }
  ],
  "summary": {
    "total": 1,
    "successful": 1,
    "failed": 0,
    "processedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Extract Text from Base64 Image
```
POST /api/extract-text-base64
Content-Type: application/json

Request:
{
  "image": "data:image/png;base64,...",
  "filename": "screenshot.png"
}

Response:
{
  "success": true,
  "data": {
    "text": "Extracted text...",
    "confidence": 0.95,
    "filename": "screenshot.png",
    "extractedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Health Check
```
GET /api/health

Response:
{
  "status": "OK",
  "message": "Screenshot Text Extractor API is running"
}
```

## Configuration

### Environment Variables (server/.env)

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)
- `MAX_FILE_SIZE` - Maximum upload file size in bytes (default: 10MB)
- `UPLOAD_DIR` - Directory to store uploaded images (default: ./uploads)

## Usage

### Single Image Mode
1. Click the upload area to select an image or drag and drop
2. Click "Extract Text" button
3. View the extracted text
4. Copy to clipboard or download as text file

### Batch Mode
1. Click the upload area to select multiple images (up to 10)
2. Click "Extract All" button
3. View results for each image
4. Download all extracted text as a single file

## OCR Features

### Image Preprocessing
- Automatic grayscale conversion
- Contrast normalization
- Sharpness enhancement
- Improved text clarity

### Text Formatting
- Preserves paragraph structure
- Maintains line breaks
- Retains text alignment information
- Confidence scores per result

## Performance Tips

1. **Image Quality** - Higher quality images produce better results
2. **Image Size** - Larger text in images yields more accurate extraction
3. **Batch Processing** - Process images sequentially for better memory management
4. **Languages** - Currently optimized for English text

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 5000
- Check CORS configuration in server/index.js
- Verify proxy setting in client/package.json

### OCR Accuracy Issues
- Use high-resolution images (300+ DPI recommended)
- Ensure good contrast between text and background
- Rotate images to correct orientation if needed

### File Upload Issues
- Check file size (max 10MB per file)
- Verify file format (PNG, JPG, WEBP, TIFF)
- Check server upload directory permissions

## Future Enhancements

- 🌍 Multi-language OCR support
- 📱 Mobile app (React Native)
- 🎨 Advanced image editing tools
- 📊 Text analysis and statistics
- 🔐 User authentication and storage
- ☁️ Cloud storage integration
- 🚀 WebSocket real-time processing

## License

MIT License - feel free to use this project for personal or commercial purposes

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy extracting! 📸✨**
