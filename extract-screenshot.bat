@echo off
REM Screenshot Text Extraction API - Windows Batch Script
REM This script extracts text from email.png screenshot using cURL

echo.
echo 🚀 Starting text extraction from screenshot...
echo.
echo 📤 Sending request to API...
echo 🖼️  File: email.png
echo 🌐 URL: http://localhost:5000/api/extract-text
echo.

REM Extract text from screenshot
curl -X POST http://localhost:5000/api/extract-text ^
  -F "image=@C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png"

echo.
echo ✅ Request completed!
pause
