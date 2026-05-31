import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

public class ExtractScreenshotText {
    
    public static void main(String[] args) {
        String imagePath = "C:\\Users\\KRISHNA PAUL\\OneDrive\\Pictures\\Screenshots\\email.png";
        System.out.println("🚀 Starting text extraction from screenshot...\n");
        extractText(imagePath);
    }
    
    static void extractText(String imagePath) {
        try {
            // Verify file exists
            File imageFile = new File(imagePath);
            if (!imageFile.exists()) {
                System.out.println("❌ File not found: " + imagePath);
                System.out.println("Please check the path and try again.");
                return;
            }

            System.out.println("📤 Sending request to API...");
            System.out.println("🖼️  File: " + imageFile.getName());
            System.out.println("🌐 URL: http://localhost:5000/api/extract-text\n");

            // Create URL connection
            URL url = new URL("http://localhost:5000/api/extract-text");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(30000);
            
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
            System.out.println("📥 Response Code: " + responseCode);

            if (responseCode == HttpURLConnection.HTTP_OK) {
                String response = readResponse(connection.getInputStream());
                parseAndPrintResponse(response);
            } else {
                String error = readResponse(connection.getErrorStream());
                System.out.println("❌ Error: " + error);
            }

            connection.disconnect();
            
        } catch (Exception e) {
            if (e.getMessage().contains("Connection refused")) {
                System.out.println("❌ Cannot connect to API!");
                System.out.println("Make sure backend is running: npm run dev (in server folder)");
            } else {
                System.out.println("❌ Exception: " + e.getMessage());
                e.printStackTrace();
            }
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
            // Simple JSON parsing (no external library needed)
            if (jsonResponse.contains("\"success\":true")) {
                // Extract text between "text": and next comma
                int textStart = jsonResponse.indexOf("\"text\":\"") + 8;
                int textEnd = jsonResponse.indexOf("\",\"confidence\"");
                String text = jsonResponse.substring(textStart, textEnd);
                text = text.replace("\\n", "\n");
                
                // Extract confidence
                int confStart = jsonResponse.indexOf("\"confidence\":") + 13;
                int confEnd = jsonResponse.indexOf(",", confStart);
                double confidence = Double.parseDouble(jsonResponse.substring(confStart, confEnd));
                
                System.out.println("✅ SUCCESS! Text Extracted from Screenshot:\n");
                System.out.println("━".repeat(70));
                System.out.println(text);
                System.out.println("━".repeat(70));
                System.out.println("\n📊 Confidence: " + String.format("%.2f%%", confidence * 100));
                System.out.println("📏 Text Length: " + text.length() + " characters");
            } else {
                System.out.println("❌ Extraction failed");
            }
        } catch (Exception e) {
            System.out.println("❌ Error parsing response: " + e.getMessage());
            System.out.println("Raw Response: " + jsonResponse);
        }
    }
}
