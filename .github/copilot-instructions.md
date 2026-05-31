# Screenshot Text Extractor - Development Guide

This is a full-stack application for extracting text from screenshots and images using OCR.

## Project Overview

- **Backend**: Node.js/Express API with Tesseract.js OCR
- **Frontend**: React application with batch processing support
- **Features**: Single/batch upload, image preprocessing, text export

## Quick Start

### Backend
```bash
cd server
npm install
npm run dev    # Starts on port 5000
```

### Frontend
```bash
cd client
npm install
npm start      # Starts on port 3000
```

## Key Files

- `server/index.js` - Main API server
- `server/controllers/ocrController.js` - OCR logic
- `client/src/App.js` - Main React component
- `client/src/components/SingleExtractor.js` - Single image extraction UI
- `client/src/components/BatchExtractor.js` - Batch processing UI

## API Endpoints

- `POST /api/extract-text` - Single image extraction
- `POST /api/extract-text-batch` - Batch image extraction
- `POST /api/extract-text-base64` - Base64 image extraction
- `GET /api/health` - Health check

## Configuration

Backend environment variables in `server/.env`:
- `PORT` - Server port (default: 5000)
- `MAX_FILE_SIZE` - Max upload size (default: 10MB)
- `UPLOAD_DIR` - Upload directory (default: ./uploads)

## Architecture

```
User → React Frontend (Port 3000)
  ↓
  HTTP Requests
  ↓
Express API (Port 5000)
  ↓
Tesseract.js OCR Engine
  ↓
Processed Images in ./uploads
```

## Common Tasks

### Adding New Features
1. Backend: Add endpoint in `server/index.js`
2. Backend: Add controller logic in `server/controllers/`
3. Frontend: Create new component in `client/src/components/`
4. Frontend: Update routing in `client/src/App.js`

### Debugging
- Check server logs for API errors
- Use browser DevTools for frontend issues
- Verify file upload permissions in `./uploads` directory

### Deployment
- Build frontend: `cd client && npm run build`
- Deploy `client/build` to static hosting
- Deploy backend to Node.js hosting (Heroku, Railway, etc.)
