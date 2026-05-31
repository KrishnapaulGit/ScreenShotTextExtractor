# Screenshot Text Extraction API - PowerShell Script
# This script extracts text from email.png screenshot

Write-Host "`n🚀 Starting text extraction from screenshot...`n" -ForegroundColor Green

$imagePath = "C:\Users\KRISHNA PAUL\OneDrive\Pictures\Screenshots\email.png"
$apiUrl = "http://localhost:5000/api/extract-text"

# Check if file exists
if (-not (Test-Path $imagePath)) {
    Write-Host "❌ File not found: $imagePath" -ForegroundColor Red
    exit
}

Write-Host "📤 Sending request to API..." -ForegroundColor Cyan
Write-Host "🖼️  File: $(Split-Path $imagePath -Leaf)"
Write-Host "🌐 URL: $apiUrl`n"

try {
    # Create multipart form data
    $form = @{
        image = Get-Item -Path $imagePath
    }
    
    # Send request
    $response = Invoke-WebRequest -Uri $apiUrl -Method Post -Form $form
    
    # Parse response
    $jsonData = $response.Content | ConvertFrom-Json
    
    if ($jsonData.success) {
        Write-Host "✅ SUCCESS! Text Extracted from Screenshot:`n" -ForegroundColor Green
        Write-Host ("━" * 70)
        Write-Host $jsonData.data.text
        Write-Host ("━" * 70)
        Write-Host "`n📊 Confidence: $($jsonData.data.confidence * 100)%" -ForegroundColor Yellow
        Write-Host "📁 Filename: $($jsonData.data.filename)"
        Write-Host "⏰ Extracted At: $($jsonData.data.extractedAt)"
        Write-Host "📏 Text Length: $($jsonData.data.text.Length) characters`n"
    } else {
        Write-Host "❌ Extraction failed: $($jsonData.error)" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Message -like "*Connection refused*") {
        Write-Host "❌ Cannot connect to API!" -ForegroundColor Red
        Write-Host "Make sure backend is running: npm run dev (in server folder)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nPress Enter to exit..."
Read-Host
