# Vercel + Everything Deployment Guide

## ✅ Everything is Ready!

Your Screenshot Text Extractor is now configured for **free Vercel hosting**. Both frontend and backend are included in one deployment.

## 🚀 Quick Deployment Steps

### 1. **Set Up Git Repository**

```bash
cd c:\Users\KRISHNA PAUL\OneDrive\Desktop\ScreenShotTextExtractor
git init
git add .
git commit -m "Initial commit - ready for Vercel deployment"
```

### 2. **Push to GitHub**

Create a new repository on [GitHub](https://github.com/new) named `ScreenShotTextExtractor`

```bash
git remote add origin https://github.com/YOUR_USERNAME/ScreenShotTextExtractor.git
git branch -M main
git push -u origin main
```

### 3. **Deploy to Vercel**

**Option A: Using Vercel Dashboard (Recommended)**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Click "Deploy"
- Done! Vercel will automatically:
  - Build your React frontend
  - Create serverless API functions
  - Deploy everything

**Option B: Using Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel
```

## 📁 Project Structure

```
ScreenShotTextExtractor/
├── api/                          # Serverless API functions
│   ├── extract-text.js           # Single image extraction
│   ├── extract-text-batch.js     # Batch image extraction
│   └── health.js                 # Health check endpoint
├── client/                        # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                        # Local Express server (for development)
│   ├── package.json
│   └── controllers/
├── vercel.json                    # Vercel configuration
└── package.json                   # Root package.json
```

## 🔗 API Endpoints (After Deployment)

Your deployed app will have:

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/`
  - `POST /api/extract-text` - Single image
  - `POST /api/extract-text-batch` - Batch images
  - `GET /api/health` - Health check

## 💻 Local Development

### Run Locally

```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm start
```

Your app will be at `http://localhost:3000`

## 🔧 Root package.json

Create a root `package.json` if you want to manage all dependencies from one place:

```bash
npm init -y
```

Then add scripts to manage both frontend and backend.

## ⚙️ Environment Variables

If you need environment variables in production:

1. In Vercel dashboard, go to **Settings > Environment Variables**
2. Add any variables your API needs (e.g., `MAX_FILE_SIZE`, `UPLOAD_DIR`)

## 📊 Performance Tips

- **OCR Processing**: Tesseract.js can take 10-30 seconds per image
- **Batch Processing**: Processes images sequentially to avoid memory issues
- **File Size**: Max 10MB per image (configurable in Vercel environment)
- **Timeout**: Set to 300 seconds (5 minutes) - enough for OCR processing

## ✨ What's Included

✅ React frontend with single & batch upload  
✅ Serverless API functions (no need for separate backend server)  
✅ OCR text extraction using Tesseract.js  
✅ Image preprocessing (grayscale, normalization, sharpening)  
✅ Batch processing support  
✅ Free forever on Vercel  
✅ CORS enabled for cross-origin requests  
✅ Automatic builds and deployments on git push  

## 🎉 Done!

After deployment, share your app URL with anyone. They can start using it immediately!

Example URL: `https://screenshot-text-extractor-abc123.vercel.app`

## 📝 Next Steps

1. Test your deployment at the Vercel URL
2. Try uploading images
3. Check that OCR extraction works
4. Share with users!

For more info: [Vercel Documentation](https://vercel.com/docs)
